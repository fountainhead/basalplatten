import * as React from 'react';
import {UIRouterReact, UIRouter, UIView, servicesPlugin, pushStateLocationPlugin} from 'ui-router-react';
import {ParamTypeDefinition, UrlParts} from 'ui-router-core';
import {UIRouterRx} from 'ui-router-rx';
import {notification} from 'antd';
import * as paramTypes from './ui-router/paramTypes';

export const buildRouter = (): UIRouterReact => {
  var router = new UIRouterReact();

  router.plugin(servicesPlugin);
  router.plugin(pushStateLocationPlugin);
  router.plugin(UIRouterRx);

  router.stateService.defaultErrorHandler(err => {
    notification.error({
      message: 'State Transition Error',

      description: (
        <div>
          <p>The following error was encountered during a UI state transition:</p>
          <code>{err.stack}</code>
        </div>
      ),

      duration: null
    });
  });

  router.urlRouter.otherwise((matchValue, url, router) => {
    notification.info({
      message: 'Unknown URL',
      description: `The URL ${url.path} does not exist. You have been redirected to the home page.`
    });

    return '/';
  });

  Object.keys(paramTypes).forEach(name => {
    router.urlMatcherFactory.type(name, paramTypes[name]);
  });

  return router;
}
