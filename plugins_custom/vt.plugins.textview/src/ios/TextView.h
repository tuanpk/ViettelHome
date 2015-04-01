#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>

@interface TextView : CDVPlugin
{
    UITextView *textView;
    CGRect frameTextView;
}
- (void) init:(CDVInvokedUrlCommand*)command;
-(void) setFrame:(CDVInvokedUrlCommand*)command;
-(void) hidden:(CDVInvokedUrlCommand*)command;
-(void) show:(CDVInvokedUrlCommand*)command;
-(void) destroy:(CDVInvokedUrlCommand*)command;
-(void) getValueTextView:(CDVInvokedUrlCommand*)command;
-(void) clearText:(CDVInvokedUrlCommand*)command;

@end