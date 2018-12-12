"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_1 = require("@angular/platform-browser");
const core_1 = require("@angular/core");
const ionic_angular_1 = require("ionic-angular");
const splash_screen_1 = require("@ionic-native/splash-screen");
const status_bar_1 = require("@ionic-native/status-bar");
const app_component_1 = require("./app.component");
const home_1 = require("../pages/home/home");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.MyApp,
            home_1.HomePage
        ],
        imports: [
            platform_browser_1.BrowserModule,
            ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp)
        ],
        bootstrap: [ionic_angular_1.IonicApp],
        entryComponents: [
            app_component_1.MyApp,
            home_1.HomePage
        ],
        providers: [
            status_bar_1.StatusBar,
            splash_screen_1.SplashScreen,
            { provide: core_1.ErrorHandler, useClass: ionic_angular_1.IonicErrorHandler }
        ]
    })
], AppModule);
exports.AppModule = AppModule;
