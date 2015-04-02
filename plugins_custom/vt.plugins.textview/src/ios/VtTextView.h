#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>

@interface VtTextView : CDVPlugin
{
    UITextView *textView;
    CGRect frameTextView;
}
- (void) init:(CDVInvokedUrlCommand*)command;
-(void) setFrame:(CDVInvokedUrlCommand*)command;
-(void) hide:(CDVInvokedUrlCommand*)command;
-(void) show:(CDVInvokedUrlCommand*)command;
-(void) destroy:(CDVInvokedUrlCommand*)command;
-(void) getText:(CDVInvokedUrlCommand*)command;
-(void) setText:(CDVInvokedUrlCommand*)command;

@end