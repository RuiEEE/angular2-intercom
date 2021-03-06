import { Inject, Injectable, PLATFORM_ID, InjectionToken, Optional, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { IntercomConfig } from '../shared/intercom-config';
import { Any, BootInput } from '../types/boot-input';

/**
 * A provider with every Intercom.JS method
 * @export
 * @class Intercom
 */
@Injectable()
export class Intercom {

  id: string;

  constructor(
    @Inject(IntercomConfig) private config: IntercomConfig,
    @Optional() @Inject(Router) private router: Router,
    @Inject(PLATFORM_ID) protected platformId: Object,
  ) {

    if(!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadIntercom(config);
    if (config.updateOnRouterChange) {
      this.router.events.subscribe(event => {
        this.update();
      });
    } else if (isDevMode()) {
      console.warn('Common practice in single page applications is to update whenever the route changes. ng-intercom supports this functionality out of the box; just set `updateOnRouterChange` to true in your Intercom Module config. This warning will not appear in production, if you choose not to use router updating.')
    }
  }

  /**
   * If you'd like to control when Intercom is loaded, you can use the 'boot' method. This is useful in situations like a one-page Javascript based application where the user may not be logged in when the page loads. You call this method with the standard intercomSettings object.
   * @param {object} [intercomData] Your intercom configuration
   */
  boot(intercomData?: BootInput) {
    if(isPlatformServer(this.platformId)) {
      return;
    }
    
    let data = {
      ...intercomData,
      app_id: this.config.appId
    }

    return (<any>window).Intercom('boot', data);
  }

  /**
   * If you have the Respond product (combined with another product like Engage) you should call the Intercom shutdown method to clear your users’ conversations anytime they logout of your application. Otherwise, the cookie we use to track who was most recently logged in on a given device or computer will keep these conversations in the Messenger for one week. This method will effectively clear out any user data that you have been passing through the JS API.
   */
  shutdown() {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    return (<any>window).Intercom("shutdown");
  }

  /**
   * Calling the update method without any other arguments will trigger the JavaScript to look for new messages that should be displayed to the current user (the one whose details are in the window.intercomSettings variable) and show them if they exist.
   *
   * Calling the update method with a JSON object of user details will update those fields on the current user in addition to logging an impression at the current URL and looking for new messages for the user.
   * @param {object} [data]
   */
  update(data?: Any) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    if (data) {
      return (<any>window).Intercom("update", data);
    } else {
      return (<any>window).Intercom("update");
    }
  }

  /**
   * This will hide the main Messenger panel if it is open. It will not hide the Messenger Launcher.
   */
  hide() {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    return (<any>window).Intercom('hide');
  }

  /**
   * This will show the Messenger. If there are no conversations it will open with the new message view, if there are it will open with the message list.
   *
   * If a `message` parameter is supplied, it will automatically open a new message window, aliasing showNewMessage().
   *
   * @param {string} [message]
   */
  show(message?: string) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    if (message) {
      return (<any>window).Intercom('show');
    } else {
      return this.showNewMessage(message);
    }
  }

  /**
   * To open the message window with the message list you can call `showMessages()`.
   */
  showMessages() {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    return (<any>window).Intercom('showMessages');
  }

  /**
   * To open the message window with the new message view you can call showNewMessage().
   *
   * This function takes an optional parameter that can be used to pre-populate the message composer as shown below.
   * @param {string} message
   */
  showNewMessage(message?: string) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    if (message) {
      return (<any>window).Intercom('showNewMessage', message);
    } else {
      return (<any>window).Intercom('showNewMessage');
    }
  }

  /**
   * You can submit an event using the trackEvent method. This will associate the event with the currently logged in user and send it to Intercom. The final parameter is a map that can be used to send optional metadata about the event.
   *
   * You can also add custom information to events in the form of event metadata.
   * @param {string} eventName
   * @param {*} [metadata]
   */
  trackEvent(eventName: string, metadata?: any) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    if (metadata) {
      return (<any>window).Intercom('trackEvent', eventName, metadata);
    } else {
      return (<any>window).Intercom('trackEvent', eventName);
    }
  }

  /**
   * A visitor is someone who goes to your site but does not use the messenger. You can track these visitors via the visitor user_id. This user_id can be used to retrieve the visitor or lead through the REST API.
   * @returns {string}
   */
  getVisitorId(): string {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    return (<any>window).Intercom('getVisitorId');
  }

  /**
   * Alias for getVisitorId()
   * @alias getVisitorId()
   * @readonly
   * @type {string}
   */
  get visitorId(): string {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    return (<any>window).Intercom('getVisitorId');
  }

  /**
   * Gives you the ability to hook into the show event. Requires a function argument.
   * @param {() => void} handler
   */
  onShow(handler: () => void) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    return (<any>window).Intercom('onShow', handler);
  }

  /**
   * Gives you the ability to hook into the hide event. Requires a function argument.
   *
   * @param {() => void} handler
   */
  onHide(handler: () => void) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    return (<any>window).Intercom('onHide', handler);
  }

  /**
   * This method allows you to register a function that will be called when the current number of unread messages changes.
   * @param {(unreadCount?: number) => void} handler
   */
  onUnreadCountChange(handler: (unreadCount?: number) => void) {
    if(isPlatformServer(this.platformId)) {
      return;
    }

    return (<any>window).Intercom('onUnreadCountChange', handler);
  }

  l() {
    let d = document;
    var s = d.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = `https://widget.intercom.io/widget/` + this.id;
    var x = d.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  }
  
  loadIntercom(config: IntercomConfig) {
    this.id = config.appId;
    var w = <any>window;
    var ic = w.Intercom;
    if (typeof ic === 'function') {
      ic('reattach_activator');
      ic('update', config);
    } else {
      let i: any = function () {
        i.c(arguments);
      };
      i.q = [];
      i.c = function (args: any) {
        i.q.push(args);
      };
      w.Intercom = i;
      if (w.attachEvent) {
        w.attachEvent('onload', this.l);
      } else {
        w.addEventListener('load', this.l, false);
      }
    }
  };
}
