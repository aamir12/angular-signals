import 'zone.js/dist/zone';
import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChildComponent } from './child/child.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ChildComponent],
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

        <li *ngFor="let emp of employees();index as i" (click)="removeEmployee(i)">
             {{ emp.name  }} {{ emp.contact }} 
        </li>

      </ul>
      <form [formGroup]="employeeForm" >
        <input type="text" formControlName="name"  placeholder="Enter Name">
        <input type="text" formControlName="contact"  placeholder="Enter Contact">
        <button type="button" (click)="addByMutate()"> Add by mutate</button>
        <button type="button" (click)="addByUpdate()"> Add by update</button>
      </form>

      <h4>Object</h4>

      Name {{person().name}}
      Contact {{person().contact}}

      <button type="button" (click)="changeContact()">Change Contact</button>
    </div>

    <div>
      <h3>Child Component</h3>
      <app-child [emp]="person()"></app-child>
    </div>


    <div>
      <h3>Effect</h3>
      <p>It is use to perform side effect.</p>

    </div>


    <div>
      <h3>Simple Form Control</h3>
      <div>
        <label>City</label> 
        <select [ngModel]="city()" (change)="onCityChange($any($event.target).value)">
          <option value=''>Selected City</option>
          <option *ngFor="let c of cities" [value]="c">
            {{c}}
          </option>
        </select>

        {{ city() }}
      </div>

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

  city = signal<string>('');
  cities = ['Mumbai', 'Bhopal', 'Indore'];

  onCityChange(value: string) {
    //this.city.update((oldCity) => value); //alternative
    this.city.set(value);
  }

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

  addByMutate() {
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

  addByUpdate() {
    if (this.employeeForm.invalid) {
      return;
    }
    const emp = {
      name: this.employeeForm.value.name!.toString(),
      contact: this.employeeForm.value.contact!.toString(),
    };

    this.employees.update((empList) => [...empList, emp]);
    this.employeeForm.reset();
  }

  removeEmployee(index: number) {
    this.employees.mutate((empList) => empList.splice(index, 1));
  }

  person = signal({
    name: 'Aamir',
    contact: '343434',
  });

  changeContact() {
    //update: means completely create new object and array.It creates new memory reference.
    // it will trigger ngOnChanges

    this.person.update((p) => {
      return { ...p, contact: 'New-556565' };
    });

    //mutate: it only update value. It does not create new array and object.
    //It does not change new memory reference
    //It will not trigger ngOnChanges
    //this.person.mutate((p) => (p.contact = 'New-556565'));
  }

  ////////////Effect//////////////
  personEffect = effect(() => {
    const contact = this.person().contact;
    console.log('Save in database', contact);
  });
}

bootstrapApplication(App);
