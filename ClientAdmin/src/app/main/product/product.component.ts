import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ScriptService} from 'src/app/libs/script.service';
import {ProductService} from "../../services/product.service";
import {LazyLoadEvent, PrimeNGConfig, MessageService} from "primeng/api";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {environment} from 'src/environments/environment';
import {FileService} from "../../libs/file.service";
import {FileUpload} from 'primeng/fileupload';
import {CategoryService} from 'src/app/services/category.service';

declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [MessageService]
})
export class ProductComponent extends ScriptService implements OnInit {
  @ViewChild(FileUpload, {static: false}) file: FileUpload
  public Editor = ClassicEditor;
  list = [];
  totalRecords: number;
  loading: boolean;
  form: FormGroup;
  first = 0;
  rows = 10;
  aoe: boolean;
  images = [];
  categories = [];
  submitted: boolean;

  constructor(
    injector: Injector,
    private productService: ProductService,
    private primeConfig: PrimeNGConfig,
    private messageService: MessageService,
    private fileService: FileService,
    private categoryService: CategoryService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    //Load icon
    this.loading = true;
    this.primeConfig.ripple = true;

    //Load script
    let elem = document.getElementsByClassName('script');
    if (elem.length != undefined) {
      for (var i = elem.length - 1; 0 <= i; i--) {
        elem[i].remove();
      }
    }
    this.loadScripts();

    //Validation
    this.form = new FormGroup({
      'id': new FormControl(),
      'name': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(250)
      ]),
      'slug': new FormControl('', [
        Validators.maxLength(250)
      ]),
      'price': new FormControl(0, [
        Validators.required,
        Validators.min(0)
      ]),
      'sale': new FormControl(0, [
        Validators.min(0),
        Validators.max(100)
      ]),
      'description': new FormControl(),
      'content': new FormControl(),
      'category': new FormControl('', [
        Validators.required
      ]),
      'options': new FormArray([this.initItemRows()])
    })

    //Load data
    this.loadData({first: this.first, rows: this.rows});
  }

  get formArr() {
    return this.form.get('options') as FormArray;
  }

  initItemRows(name = '#ff0000', color = '#ff0000', quantity = 0, price = 0) {
    return new FormGroup({
      'name': new FormControl(name),
      'color': new FormControl(color),
      'quantity': new FormControl(quantity, [
        Validators.required
      ]),
      'price': new FormControl(price),
    });
  }

  addNewRow() {
    this.formArr.push(this.initItemRows());
  }

  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }

  changeColor(event, index) {
    this.formArr.value[index].name = event.value;
  }

  loadData(event: LazyLoadEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.loading = true;
    setTimeout(() => {
      this.productService.getPage(this.first, this.rows).subscribe((res: any) => {
        this.list = res.list;
        this.totalRecords = res.total;
        this.loading = false;
      })
    }, 1000)
  }

  showModal() {
    this.submitted = false;
    this.form.reset();
    this.file.clear();
    this.formArr.clear();
    this.addNewRow();
    $("#largeModal").modal("show");

    this.categoryService.getAll().subscribe((data: any) => {
      this.categories = data.filter(e => {
        return e.status == true;
      });
    })
  }

  create() {
    this.aoe = true;
    this.showModal();
  }

  edit(id) {
    this.showModal();
    this.aoe = false;
    this.productService.edit(id).subscribe((data: any) => {
      let product = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        price: data.price,
        sale: data.sale,
        description: data.description,
        content: data.content,
        status: data.status,
        category: data.categories,
      }
      this.images = data.images;
      this.form.patchValue(product);
      this.formArr.clear();
      data.options.map(op => {
        this.formArr.push(this.initItemRows(op.name, op.name, op.quantity, op.price))
      })

    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    if (this.aoe == true) {
      let product = {
        name: this.form.value.name,
        slug: this.slug(this.form.value.slug) ?? this.slug(this.form.value.name),
        price: this.form.value.price,
        sale: this.form.value.sale,
        description: this.form.value.description,
        content: this.form.value.content,
        options: this.form.value.options,
        categoryId: this.form.value.category.id,
        images: []
      }

      product.options.map(e => {
        if (e.name == null) {
          return e.name = e.color;
        }
        return e.name;
      })
      this.fileService.getEncodeFromImages(this.file.files).then((data: any) => {
        if (data != null) {
          data.map(e => {
            return product.images.push({name: e});
          })
        }
        console.log(product);
        
        this.productService.create(product).subscribe((res: any) => {
          this.submitted = false;
          $("#largeModal").modal("hide");
          this.loadData({first: this.first, rows: this.rows});
          this.messageService.add({severity: 'success', summary: 'Thành công!', detail: res.message});
        }, err => {
          console.log(err);
          this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: 'Thêm sản phẩm thất bại!'});
        })
      })
    } else {
      this.form.value.categoryId = this.form.value.category.id;
      this.fileService.getEncodeFromImages(this.file.files).then((data: any) => {
        if (data != null) {
          this.form.value.images = [];
          data.map(e => {
            return this.form.value.images.push({name: e});
          })
        }
        this.form.value.options.map(e => {
          if (e.name == null) {
            return e.name = e.color;
          }
          return e.name;
        })
        console.log(this.form.value)
        this.productService.update(this.form.value.id, this.form.value).subscribe((res: any) => {
          this.submitted = false;
          this.loadData({first: this.first, rows: this.rows});
          $("#largeModal").modal("hide");
          this.messageService.add({severity: 'success', summary: 'Thành công!', detail: res.message});
        }, err => {
          console.log(err);
          this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: err.error});
        })
      })
    }
  }

  delete(id) {
    if (confirm("Bạn muốn xóa sản phẩm này?")) {
      this.productService.delete(id).toPromise()
        .then(res => {
          this.messageService.add({severity: 'success', summary: 'Thành công!', detail: 'Xóa sản phẩm thành công!'});
          this.loadData({first: this.first, rows: this.rows});
        })
        .catch(res => {
          console.log(res);
          this.messageService.add({severity: 'error', summary: 'Thất bại!', detail: 'Thêm sản phẩm thất bại!'});
        })
    }
  }

  handleChange(event, id) {
    if (event.checked == false) {
      if (confirm("Bạn muốn ẩn sản phẩm này?")) {
        this.productService.hide(id).subscribe((res: any) => {
          this.messageService.add({severity: 'success', summary: "Thành công", detail: res.message});
        }, err => {
          console.log(err);
          this.messageService.add({severity: 'error', summary: "Thất bại", detail: err.error});
        })
      } else {
        this.loadData({first: this.first, rows: this.rows});
      }
    } else {
      if (confirm("Bạn muốn ẩn sản phẩm này?")) {
        this.productService.show(id).subscribe((res: any) => {
          this.messageService.add({severity: 'success', summary: "Thành công", detail: res.message});
        }, err => {
          console.log(err);
          this.messageService.add({severity: 'error', summary: "Thất bại", detail: err.error});
        })
      } else {
        this.loadData({first: this.first, rows: this.rows});
      }
    }
  }

  slug(name: string) {
    if (name == null) {
      return;
    }

    name.toLowerCase();

    name = name.replace(/\s+/g, "-");

    name = name.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    name = name.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    name = name.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    name = name.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    name = name.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    name = name.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    name = name.replace(/đ/gi, 'd');

    name = name.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '-');

    name = name.replace(/\-\-\-\-\-/gi, '-');
    name = name.replace(/\-\-\-\-/gi, '-');
    name = name.replace(/\-\-\-/gi, '-');
    name = name.replace(/\-\-/gi, '-');

    name = '@' + name + '@';
    var slug = name.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
  }
}
