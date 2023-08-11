import 'zone.js/dist/zone';
import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div>
    <h3>Simple Example of singal and compute</h3>
     First Name {{firstName()}}
     <br/>
     Last Name {{lastName()}}
     <br/>
     FUll Name {{fullName()}}

     <br/>
     <input #first [value]="firstName()" placeholder="First Name" />
     <button type="button" (click)="changeFirstName(first.value)">Change</button>

     <br/>
     <input #last [value]="lastName()" placeholder="Last Name" />
     <button type="button" (click)="changeLastName(last.value)">Change</button>
    </div>

    <div>
      <h3>Update</h3>
      <p>It update value on the basis of current value and notifiy its depenedent</p>
     <button type="button" (click)="decrease()">-</button>
     {{ qty() }}
     <button type="button" (click)="increase()">+</button>
    </div>

    <div>
      <h3>Mutate</h3>
      <p>It is used with array and object</p>
      <h4>Array</h4>
      <ul>

        <li *ngFor="let emp of employees()">
             {{ emp.name  }} {{ emp.contact }} 
        </li>

      </ul>
      <form [formGroup]="employeeForm" (ngSubmit)="onFormSubmit()">
        <input type="text" formControlName="name"  placeholder="Enter Name">
        <input type="text" formControlName="contact"  placeholder="Enter Contact">
        <button type="submit"> Add </button>
      </form>

      <h4>Object</h4>

      Name {{person().name}}
      Contact {{person().contact}}

      <button type="button" (click)="changeContact()">Change Contact</button>
    </div>


    <div>
      <h3>Effect</h3>
      <p>It is use to perform side effect.</p>

    </div>
  `,
})
export class App {
  constructor(private fb: FormBuilder) {}
  /////////////Basic: signal/compute////////////////
  firstName = signal('Aamir');
  lastName = signal('Khan');

  //On the basis of dependencies, It compute the new value every time
  fullName = computed(() => this.firstName() + ' ' + this.lastName());

  changeFirstName(value: string) {
    this.firstName.set(value);
  }

  changeLastName(value: string) {
    this.lastName.set(value);
  }

  ///////////////Update//////////////////

  qty = signal<number>(5);
  decrease() {
    this.qty.update((q) => q - 1);
  }

  increase() {
    this.qty.update((q) => q + 1);
  }

  //////////Mutate////////////
  employees = signal([
    {
      name: 'aamir',
      contact: '233444555',
    },
    {
      name: 'khan',
      contact: '3455565',
    },
  ]);

  employeeForm = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    contact: ['', [Validators.required]],
  });

  onFormSubmit() {
    if (this.employeeForm.invalid) {
      return;
    }
    const emp = {
      name: this.employeeForm.value.name!.toString(),
      contact: this.employeeForm.value.contact!.toString(),
    };

    this.employees.mutate((empList) => empList.push(emp));
    this.employeeForm.reset();
  }

  person = signal({
    name: 'Aamir',
    contact: '343434',
  });

  changeContact() {
    this.person.mutate((p) => (p.contact = 'New-556565'));
  }

  ////////////Effect//////////////
  personEffect = effect(() => {
    const contact = this.person().contact;
    console.log('Save in database', contact);
  });
}

bootstrapApplication(App);
