/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <GoogleMaps/GoogleMaps.h>
#import "Mixpanel/Mixpanel.h"
#import <React/RCTLinkingManager.h>

#import <TSBackgroundFetch/TSBackgroundFetch.h>

@implementation AppDelegate

//start code for social sign ins
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}


- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
//end code for soical sign ins

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  [GMSServices provideAPIKey:@"AIzaSyCzGVp8tuZ-WLmszWbbZG4oAvWLKMiGO9M"];

  [Mixpanel sharedInstanceWithToken:@"d2c22c7156bc4983968bce21e605cd80"];
  
//start mixpanel push notifications
  Mixpanel *mixpanel = [Mixpanel sharedInstance];

  // Tell iOS you want your app to receive push notifications
  // This code will work in iOS 8.0 xcode 6.0 or later:
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)
  {
      [[UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge) categories:nil]];
      [[UIApplication sharedApplication] registerForRemoteNotifications];
  }
  // This code will work in iOS 7.0 and below:
  else
  {
  }

  // Call .identify to flush the People record to Mixpanel
  [mixpanel identify:mixpanel.distinctId];
//end mixpanel push notifications
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Oxygen"
                                            initialProperties:nil];

  // [REQUIRED] Register BackgroundFetch
  [[TSBackgroundFetch sharedInstance] didFinishLaunching];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}


//more code for mixpanel push notifications
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    Mixpanel *mixpanel = [Mixpanel sharedInstance];

    [mixpanel.people addPushDeviceToken:deviceToken];
}

//end more code for mixpanel push notifications

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
