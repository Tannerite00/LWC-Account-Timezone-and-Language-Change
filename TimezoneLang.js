import { LightningElement,api, track } from 'lwc';
import FORM_FACTOR from '@salesforce/client/formFactor';

//from controller class
import updateTimeZoneAndLanguage from '@salesforce/apex/AccountInformationCtrl.updateTimeZoneAndLanguage';
import getTimeZoneAndLang from'@salesforce/apex/AccountInformationCtrl.getTimeZoneAndLang';

export default class AccountTimeZoneAndLang extends LightningElement {

//api labels
    @api timeZoneLabel;
    @api defaultLanguageLabel;
    @api saveChangesLabel;

    @track timezone;                  
    defaultTZvalue = '';

    @track langSelected;         
    iniLanguageSelected = '';

    isButtonDisabled = true;
    buttonStyle = 'button-disabled';
    
    oldLanguage= this.iniLanguageSelected;
    newTimezone= this.timezone;
    newLanguage= this.langSelected;
    
    FORM_FACTOR;

    get isPhone(){
        return this.FORM_FACTOR == 'Small';
    }

    get isDesktop(){
        return this.FORM_FACTOR == 'Large';
    }

    get engLangButtonStyle(){
        return this.langSelected == 'en_US' ? 'lang-button' : 'lang-button-disabled';
    }

    get frLangButtonStyle(){
        return this.langSelected == 'fr' ? 'lang-button' : 'lang-button-disabled';
    }

    connectedCallback(){
        getTimeZoneAndLang().then(result =>{
            console.log(result);
            let user = JSON.parse(result);
            this.timezone = user.TimeZoneSidKey;
            this.newTimezone = user.TimeZoneSidKey;
            this.defaultTZvalue = user.TimeZoneSidKey;
            this.langSelected = user.LanguageLocaleKey;
            this.newLanguage = user.LanguageLocaleKey;
            this.iniLanguageSelected = user.LanguageLocaleKey;
        }).catch(error => {
            console.log(error);
        })

        this.FORM_FACTOR = FORM_FACTOR;
        console.log('this.FORM_FACTOR: '+this.FORM_FACTOR);

    }

    get options() {

        return [
            {label: 'Newfoundland Time', value: 'America/St_Johns' },
            {label: 'Atlantic Time', value: 'America/Curacao'},
            {label: 'Eastern Time', value: 'America/Detroit' },
            {label: 'Central Time', value: 'America/Costa_Rica' },            
            {label: 'Central Time (SK)', value: 'America/Chicago'},
            {label: 'Mountain Time', value: 'America/Boise'},
            {label: 'Pacific Time', value: 'America/Los_Angeles'}
        ];

    }

    handleTimeZoneChange(event){
        this.timezone = event.detail.value;
        console.log('timezone: ', this.timezone);
        this.newTimezone = this.timezone;
        console.log('new time zone', this.newTimezone);
        console.log('default TZ value: ', this.defaultTZvalue);
      if(this.timezone == this.defaultTZvalue && this.langSelected == this.iniLanguageSelected){
        this.isButtonDisabled = true;
        this.buttonStyle = 'button-disabled';
       
    }
    else{
     this.isButtonDisabled = false;
     this.buttonStyle = 'button';
    }
        console.log('isButtonDisabled---'+this.isButtonDisabled);
    }

    handleSave(event){
        event.preventDefault();
       updateTimeZoneAndLanguage({timeZone: this.newTimezone, language: this.newLanguage, defaultLanguage: this.newLanguage})
       .then(result => {
        console.log(result);
        this.buttonStyle = 'button-disabled';
        this.isButtonDisabled = true;
        this.defaultTZvalue = this.timezone;
        this.iniLanguageSelected = this.langSelected;
        })
        .catch(error => {
            console.error(error);
        }); 
    }

    handleLanguageChange(event){
        this.langSelected = event.currentTarget.dataset.name;
       console.log('this.langSelected----'+this.langSelected);
       this.newLanguage = this.langSelected;
        console.log('new language: ', this.newLanguage);
       if(this.langSelected == this.iniLanguageSelected && this.timezone == this.defaultTZvalue){
           this.isButtonDisabled = true;
           this.buttonStyle = 'button-disabled';
       }
       else{
        this.isButtonDisabled = false;
        this.buttonStyle = 'button';
       }
       console.log('isButtonDisabled---'+this.isButtonDisabled);
    }
}
