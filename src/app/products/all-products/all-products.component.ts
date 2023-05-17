import { Component, OnInit } from '@angular/core';
import { SingleProduct } from 'src/app/shared/models';
import { ModeService } from 'src/app/shared/services/mode.service';
import { ProductsService } from '../services/products.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})

export class AllProductsComponent implements OnInit{
  constructor(private notificationService: NotificationService, private productService: ProductsService, private modeService: ModeService, private modalService: NgbModal, config: NgbModalConfig) {
    config.backdrop = 'static';
		config.keyboard = false;
  }
  
  products = [];
  categories = [];
  loading = false;
  mode = 'user';
  faDel = faTrash;
  addingType = '';
  productPrice = 1;
  myForm: FormGroup;
  selectedCategory = "";
  modifiedImage = null;
  newProduct = true;
  formLoading = false;
  newProductId = null;
  productToUpdate = null;
  updatedProducts:any = [];
  productToDelete = null;

  ngOnInit(): void {
    this.getMode();

    this.getCategories();
    this.getProducts();
  }


  openAddProduct(content, type, modalSize, product=null) {
    this.addingType = type;
    if (this.addingType == 'Add category') {
      this.myForm = new FormGroup({
        'newCategory': new FormControl(null, [Validators.required, this.categoryValidator.bind(this)])
      })
    }

    if (this.addingType == 'Add product' || this.addingType == 'Update product') {
      if (product) {
        this.productToUpdate = product;
      } else {
        this.productToUpdate = null;
      }

      this.myForm = new FormGroup({
        'id': new FormControl(this.productToUpdate?this.productToUpdate.id:this.newProductId, Validators.required),
        'title': new FormControl(this.productToUpdate?this.productToUpdate.title:null, [Validators.required, this.productTitleValidator.bind(this)]),
        'price': new FormControl(this.productToUpdate?this.productToUpdate.price:this.productPrice.toFixed(2), Validators.required),
        'description': new FormControl(this.productToUpdate?this.productToUpdate.description:null, Validators.required),
        'category': new FormControl(this.productToUpdate?this.productToUpdate.category:this.categories[0], Validators.required),
        'rating': new FormGroup({
          'count': new FormControl(this.productToUpdate?this.productToUpdate.rating.count:0),
          'rate': new FormControl(this.productToUpdate?this.productToUpdate.rating.rate:0)
        }),
        'image': new FormControl(this.productToUpdate?this.productToUpdate.image:null, Validators.required)
      })
    }
    
		this.modalService.open(content, { centered: true, size: modalSize });
	}

  categorySelected(event) {
    this.selectedCategory = event.target.value;
    this.myForm.patchValue({
      'category': this.selectedCategory
    })
  }

  categoryValidator(control: FormControl): {[s:string]: boolean} {
    if (this.categories.indexOf(control.value) != -1) {
      return {'categoryExists': true};
    } else {
      return null;
    }
  }

  productTitleValidator(control: FormControl): {[s:string]: boolean} {
    if (this.products.find(item => item.title == control.value)) {
      if (this.productToUpdate && control.value == this.productToUpdate.title) {
        return null;
      } else {
        return {'titleIsUsed': true};
      }
    } else {
      return null;
    }
  }

  setImage(imageUrl) {
    this.modifiedImage = imageUrl;
    this.myForm.patchValue({
      'image': this.modifiedImage
    })
  }

  getMode() {
    let modeStorage = JSON.parse(localStorage.getItem('mode'));

    if (modeStorage) {
      this.mode = modeStorage;
    } else {
      this.mode = 'user';
    }

    this.loading = true;
    this.modeService.mode.subscribe({
      next: (v) => {
        this.mode = v;
        this.loading = false;
      },
      error: (e) => {
        this.notificationService.showError(e.message);
        this.loading = false;
      }
    });
  }

  getProducts() {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res:[]) => {
        this.products = [];
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            this.products.push(res[key]);
          }
        }
        this.updatedProducts = res;
        this.loading = false;
        this.newProductId = this.products.length;
        if (this.myForm) {
          this.myForm.patchValue({
            'id': this.newProductId
          });
          this.formLoading = false;
        }
      }, 
      error: (e) => {
        this.notificationService.showError(e.message);
        this.loading = false;
      }
    });
  }

  confirmDelete(name, product) {
    this.productToDelete = product;
    this.modalService.open(name, { centered: true, size: "lg" });
  }

  deleteProduct(product) {
    let productKey = '';
    for(let key in this.updatedProducts) {
      if (this.updatedProducts[key].id == product.id) {
        productKey = key;
      }
    }

    this.loading = true;
    this.productService.delProduct(productKey).subscribe({
      next: (res) => {
        this.notificationService.showSuccess(product.title + ' is deleted successfully');
        this.getProducts();
      },
      error: (e) => {
        this.notificationService.showError(e.message);
        this.loading = false;
      }
    });
  }

  getCategories() {
    this.loading = true;
    this.productService.getAllCategories().subscribe({
      next: (v:[]) => {
        this.categories = v;
        this.loading = false;
      }, 
      error: (e) => {
        this.notificationService.showError(e.message);
        this.loading = false;
      }
    })
  }

  filterProducts(event: any) {
    let category: string = event.target.value;
    (category == "all") ? this.getProducts() : this.getFilteredProducts(category);
  }

  getFilteredProducts(category: string) {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = [];
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            if(res[key].category == category) {
              this.products.push(res[key]);
            }
          }
        }
        this.loading = false;
      }, 
      error: (e) => {
        this.notificationService.showError(e.message);
        this.loading = false;
      }
    })
  }

  onSubmit(addingType) {
    this.formLoading = true;
    if (addingType == 'Add category') {
      this.productService.addCategory(this.myForm.value).subscribe({
        next: (v) => {
          this.notificationService.showSuccess(this.myForm.get('newCategory').value + ' added successfully');
          this.formLoading = false;
          this.myForm.reset();
          this.getCategories();
        },
  
        error: (e) => {
          this.notificationService.showError(e.message);
          this.formLoading = false;
        }
      });
    }

    if (addingType == 'Add product') {
      this.productService.addProduct(this.myForm.value).subscribe({
        next: (v) => {
          let previousCat = this.myForm.get('category').value;
          this.notificationService.showSuccess(this.myForm.get('title').value + ' added successfully');
          this.modifiedImage = null;
          this.myForm.reset();
          this.productPrice = 1;
          this.myForm.patchValue({
            'price': this.productPrice,
            'category': previousCat,
            'rating': {
              'count': 0,
              'rate' : 0
            }
          }) 
          this.getProducts();
        },
  
        error: (e) => {
          this.notificationService.showError(e.message);
          this.formLoading = false;
        }
      });
    }

    if (addingType == 'Update product') {
      if(this.myForm.get('title').value == this.productToUpdate.title
      && this.myForm.get('price').value == this.productToUpdate.price
      && this.myForm.get('description').value == this.productToUpdate.description
      && this.myForm.get('category').value == this.productToUpdate.category
      && this.myForm.get('image').value == this.productToUpdate.image) {
        this.notificationService.showInfo('Nothing changed!');
        this.formLoading = false;
        return;
      }

      this.formLoading = true;
      for(let key in this.updatedProducts) {
        if (this.updatedProducts[key].id == this.productToUpdate.id) {
          this.updatedProducts[key] = this.myForm.value;
        }
      }
      this.productService.updateProducts(this.updatedProducts).subscribe({
        next: (res) => {
          this.productToUpdate = this.myForm.value;
          this.notificationService.showSuccess('Item updated Successfully!');
          this.formLoading = false;
          this.getProducts();
        },
        error: (e) => {
          this.notificationService.showError(e.message);
          this.formLoading = false;
        }
      });
    }
  }
}
