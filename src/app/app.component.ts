import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public employees: Employee[];
  public title: string = "test";
  public editEmployee: Employee;
  public deleteEmployee: Employee;
  public tempEmployees: Employee[];

  constructor(private employeeService: EmployeeService){}
  
  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.tempEmployees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    );
  }

  public searchEmployees(key: string): void{
    console.log(key);

    const results: Employee[] = [];
    for(const employee of this.tempEmployees){
      if(employee.name.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee);
      }
    }
    this.employees = results;
    
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add'){
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit'){
      this.editEmployee = employee;
      button.setAttribute('data-target', '#editEmployeeModal');
    }
    if (mode === 'delete'){
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    container.appendChild(button);
    button.click();

  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('modal-dismiss').click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
    
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
        alert("Employee Updated!")
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    
  }

  public onDeleteEmployee(employeeID: number): void {
    document.getElementById('delete-modal-dismiss').click();
    this.employeeService.deleteEmployee(employeeID).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    
  }
}
