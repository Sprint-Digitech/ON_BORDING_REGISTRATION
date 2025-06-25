 import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 

export interface AddCompanyDto {
    companyId?: string;
    companyName: string;
    companyCode?: string;
    industry: string;
    dateFormat: string;
    timeformat: any;
    timezone: any;
    displayFormat: any;
    companyGroupId?: string;
    dateFieldSeperator: string;
    status: any;
    companyLogo?: string;
}

export interface UserForRegistrationDto {
    firstName: string;
    lastName: string;
    tenantSchema?: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegistrationResponseDto {
    isSuccessfulRegistration: boolean;
    errros: string[];
}

@Injectable({
providedIn: 'root',
})
export class RegisterationService {
    constructor(
        private http: HttpClient,
    ) {}
    
    environment = {
      production: false,
      urlAddress: 'https://localhost:7274',
    };
    private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
     };

  public postCompany(route: string, body: AddCompanyDto) {
    let url = this.createCompleteRoute(route, this.environment.urlAddress);
    return this.http.post(url, body);
  }

    public registerUser = (route: string, body: UserForRegistrationDto) => {
    let url = this.createCompleteRoute(route, this.environment.urlAddress);
    return this.http.post<RegistrationResponseDto>(url, body);
  };
}