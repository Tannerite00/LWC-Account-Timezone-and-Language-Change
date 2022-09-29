public with sharing class TimezoneLangCtrl {

    @AuraEnabled
    public static string updateTimeZoneAndLanguage(String timeZone, String language, String defaultLanguage){
        try {
            User u = [Select Id, TimeZoneSidKey, LocaleSidKey, LanguageLocaleKey from User Where Id=:UserInfo.getUserId()];
            u.TimeZoneSidKey = timeZone;
            u.LocaleSidKey = language;
            u.LanguageLocaleKey = defaultLanguage;
            update u;
            return JSON.serialize(u);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }

    @AuraEnabled
    public static string getTimeZoneAndLang(){
        try {
            User u = [Select Id, TimeZoneSidKey, LanguageLocaleKey from User Where Id=:UserInfo.getUserId()];
            system.debug(Json.serialize(u.LanguageLocaleKey));
            system.debug(JSON.serialize(u.TimeZoneSidKey));
            return JSON.serialize(u);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
