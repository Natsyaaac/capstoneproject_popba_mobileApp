/**
* @fileOverview JavaScript Mail Library.
* @description Cross-platform email functionality for Web, Electron, and Cordova
* @author <a href="https://github.com/richardhenyash">Richard Ash</a>
* @version 2.0.0
*/
/*jshint esversion: 6 */
/* globals emailjs, $, PlatformService, OfflineService */

const MailService = (function() {
    'use strict';
    
    let isInitialized = false;
    const EMAIL_JS_USER_ID = "user_JExUJN7eCUWFqFAl29Mbl";
    const EMAIL_JS_SERVICE_ID = "PersonalGmail";
    const EMAIL_JS_TEMPLATE_ID = "balloon-pop-maths";
    
    function init() {
        if (isInitialized) return;
        
        if (typeof emailjs !== 'undefined') {
            try {
                emailjs.init(EMAIL_JS_USER_ID);
                isInitialized = true;
                console.log('EmailJS initialized');
            } catch (e) {
                console.warn('EmailJS initialization failed:', e);
            }
        } else {
            console.warn('EmailJS not loaded - email functionality will be limited');
        }
    }
    
    function isOnline() {
        if (window.OfflineService) {
            return OfflineService.isOnline();
        }
        return navigator.onLine;
    }
    
    function getPlatform() {
        if (window.PlatformService) {
            return PlatformService.getPlatform();
        }
        return 'web';
    }
    
    function sendViaEmailJS(name, email, message) {
        return new Promise(function(resolve, reject) {
            if (typeof emailjs === 'undefined') {
                reject(new Error('EmailJS not available'));
                return;
            }
            
            emailjs.send(EMAIL_JS_SERVICE_ID, EMAIL_JS_TEMPLATE_ID, {
                from_name: name,
                from_email: email,
                message: message
            })
            .then(function(response) {
                resolve(response);
            })
            .catch(function(error) {
                reject(error);
            });
        });
    }
    
    function sendViaNativeEmail(name, email, message) {
        const platform = getPlatform();
        const subject = encodeURIComponent('Balloon Pop Maths - Contact Form');
        const body = encodeURIComponent(
            'Name: ' + name + '\n' +
            'Email: ' + email + '\n\n' +
            'Message:\n' + message
        );
        
        const mailtoUrl = 'mailto:support@balloonpopmaths.com?subject=' + subject + '&body=' + body;
        
        if (platform === 'electron') {
            if (window.PlatformService) {
                PlatformService.openExternalUrl(mailtoUrl);
            } else {
                window.location.href = mailtoUrl;
            }
            return Promise.resolve({ status: 200, text: 'Email client opened' });
        } else if (platform === 'cordova') {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.email) {
                return new Promise(function(resolve, reject) {
                    window.cordova.plugins.email.open({
                        to: 'support@balloonpopmaths.com',
                        subject: 'Balloon Pop Maths - Contact Form',
                        body: 'Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message
                    }, function() {
                        resolve({ status: 200, text: 'Email sent via native app' });
                    }, function(error) {
                        reject(error);
                    });
                });
            } else {
                window.location.href = mailtoUrl;
                return Promise.resolve({ status: 200, text: 'Email client opened' });
            }
        } else {
            window.location.href = mailtoUrl;
            return Promise.resolve({ status: 200, text: 'Email client opened' });
        }
    }
    
    function send(name, email, message) {
        if (!isOnline()) {
            return sendViaNativeEmail(name, email, message);
        }
        
        if (typeof emailjs !== 'undefined' && isInitialized) {
            return sendViaEmailJS(name, email, message);
        }
        
        return sendViaNativeEmail(name, email, message);
    }
    
    return {
        init: init,
        send: send,
        sendViaEmailJS: sendViaEmailJS,
        sendViaNativeEmail: sendViaNativeEmail,
        isInitialized: function() { return isInitialized; }
    };
})();

if (typeof emailjs !== 'undefined') {
    emailjs.init("user_JExUJN7eCUWFqFAl29Mbl");
}

/**
* [Function to send email from modal contact form]
* @param  {[object]}   contactForm      [Contact form object]
* @return {[boolean]}                   [Boolean - returns false if not succesfull]
*/
function sendMail(contactForm) {
    const name = contactForm.name.value;
    const email = contactForm.email.value;
    const message = contactForm.message.value;
    
    if (window.OfflineService && !OfflineService.isOnline()) {
        MailService.sendViaNativeEmail(name, email, message)
            .then(function() {
                $("#modal-contact").modal('hide');
                $("#modal-feedback-heading-text").text("Email Client Opened");
                $("#modal-feedback-body-text").text("Please send the email from your email application.");
                $('#modal-feedback').modal();
            })
            .catch(function() {
                $("#modal-contact").modal('hide');
                $("#modal-feedback-heading-text").text("Offline");
                $("#modal-feedback-body-text").text("You are currently offline. Please try again when connected.");
                $('#modal-feedback').modal();
            });
        return false;
    }
    
    if (typeof emailjs !== 'undefined') {
        emailjs.send("PersonalGmail","balloon-pop-maths",{
            from_name: name,
            from_email: email,
            message: message
        })
        .then(
            function(response) {
                $("#modal-contact").modal('hide');
                $("#modal-feedback-heading-text").text("Success!");
                $("#modal-feedback-body-text").text("Your contact form was submitted successfully.");
                $('#modal-feedback').modal();
            },
            function(error) {
                $("#modal-contact").modal('hide');
                $("#modal-feedback-heading-text").text("Oops!");
                $("#modal-feedback-body-text").text("Your contact form was not submitted.");
                $('#modal-feedback').modal();
            }
        );
    } else {
        MailService.sendViaNativeEmail(name, email, message)
            .then(function() {
                $("#modal-contact").modal('hide');
                $("#modal-feedback-heading-text").text("Email Client Opened");
                $("#modal-feedback-body-text").text("Please send the email from your email application.");
                $('#modal-feedback').modal();
            });
    }
    
    return false;
}

window.MailService = MailService;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        MailService.init();
    });
} else {
    MailService.init();
}
