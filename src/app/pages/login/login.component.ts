import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { LoginService } from './login.service';
const TOKEN_KEY = 'auth-token';
const REFRESH_KEY = 'auth-refresh'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null,
  };
  loginForm = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });
  submitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  error = '';
  roles: string[] = [];
  res: any;
  cookieValue;
  flagvalue;
  countryName;
  valueset;
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Français', flag: 'assets/images/flags/french.jpg', lang: 'fr' },
  ];
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    public languageService: LanguageService,
    public cookiesService: CookieService
  ) {}

  ngOnInit(): void {
    this.cookieValue = this.cookiesService.get('lang');
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = 'assets/images/flags/us.jpg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  signOut(): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    window.sessionStorage.removeItem(TOKEN_KEY);
    return window.sessionStorage.getItem(TOKEN_KEY);
  }
  public saveRefresh(token: string): void {
    window.sessionStorage.removeItem(REFRESH_KEY);
    window.sessionStorage.setItem(REFRESH_KEY, token);
  }

  public getRefresh(): string | null {
    window.sessionStorage.removeItem(REFRESH_KEY);
    return window.sessionStorage.getItem(REFRESH_KEY);
  }
  goToHome() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.submitted = true;
    if (
      this.loginForm.controls.username.status != 'INVALID' &&
      this.loginForm.controls.password.status != 'INVALID'
    ) {
      this.loginService
        .login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe({
          next: (data) => {
            this.res = data;
            this.isLoginFailed = false;
            this.isLoggedIn = true;
            this.saveToken(this.res.access_token);
            this.saveRefresh(this.res.refresh_token);
            this.goToHome();
          },
          error: () => {
            window.sessionStorage.removeItem(TOKEN_KEY);
            window.sessionStorage.removeItem(REFRESH_KEY);
            this.router.navigate['login'];
          },
        });
    }
  }
}
