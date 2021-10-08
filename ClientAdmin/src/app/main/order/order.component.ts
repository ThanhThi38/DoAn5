import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScriptService } from 'src/app/libs/script.service';
import { OrderService } from "../../services/order.service";
import { LazyLoadEvent, PrimeNGConfig, MessageService } from "primeng/api";
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    providers: [MessageService]
})
export class OrderComponent extends ScriptService implements OnInit {
    list = [];
    totalRecords: number;
    cols: any[];
    loading: boolean;
    form: FormGroup;
    lastBegin: number;
    lastEnd: number;
    aoe: boolean;
    listProducts = [];
    listStatus = [
        { id: 1, name: "Chưa thanh toán" },
        { id: 2, name: "Đang xử lý" },
        { id: 3, name: "Đang giao hàng" },
        { id: 4, name: "Bị hủy" },
        { id: 5, name: "Hoàn thành" },
    ];

    constructor(
        injector: Injector,
        private orderService: OrderService,
        private primeConfig: PrimeNGConfig,
        private messageService: MessageService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        //Load icon
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
            shippingName: new FormControl({ value: '', disabled: true }),
            shippingPhone: new FormControl({ value: '', disabled: true }),
            shippingAddress: new FormControl({ value: '', disabled: true }),
            status: new FormControl(),
            id: new FormControl(),
        })

        //Load data
        this.orderService.getAll().subscribe((data: any) => {
            this.list = data;
            this.totalRecords = data.length;
        })
    }

    loadData(event: LazyLoadEvent) {
        this.loadPage(event.first, event.rows);
    }

    loadPage(first, rows) {
        this.lastBegin = first;
        this.lastEnd = rows;
        // this.loading = true;
        // setTimeout(() => {
        this.orderService.getPage(first, rows).toPromise()
            .then((res: any) => {
                this.list = res.list;
                this.totalRecords = res.total;

                // this.loading = false;
            })
            .catch(err => console.log(err));
        // }, 1000)
    }

    showModal() {
        $("#largeModal").modal("show");
    }

    edit(id) {
        this.showModal();
        this.orderService.edit(id).subscribe((data: any) => {
            this.listProducts = data.detailOrders;
            this.form.patchValue({
                shippingName: data.shipping.name,
                shippingPhone: data.shipping.phone,
                shippingAddress: data.shipping.address,
                id: data.id,
            })
            for (let i = 0; i < this.listStatus.length; i++) {
                if (this.listStatus[i].id == data.status) {
                    this.form.patchValue({ status: { id: this.listStatus[i].id, name: this.listStatus[i].name } })
                }
            }
        })
    }

    onSubmit() {
        let order = {
            id: this.form.value.id,
            status: this.form.value.status.id
        }

        this.orderService.update(this.form.value.id, order).subscribe((data: any) => {
            $("#largeModal").modal("hide");
            this.messageService.add({ severity: 'success', summary: 'Thành công!', detail: 'Đã cập nhật trạng thái!' });
            this.loadPage(this.lastBegin, this.lastEnd);
        })
    }

    delete(id) {
        if (confirm("Bạn muốn xóa sản phẩm này?")) {
            this.orderService.delete(id).subscribe((data: any) => {
                this.messageService.add({ severity: 'success', summary: 'Thành công!', detail: 'Xóa đơn hàng thành công!' });
                this.loadPage(this.lastBegin, this.lastEnd);
            }, err => {
                this.messageService.add({ severity: 'error', summary: 'Thất bại!', detail: 'Xóa đơn hàng thất bại!' });
            })
        }
    }

    createImg = (nameFile: string) => {
        return environment.urlImage + nameFile;
    }
}
