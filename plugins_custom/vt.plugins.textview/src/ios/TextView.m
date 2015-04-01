#import "TextView.h"

@implementation TextView
@synthesize commandDelegate;

- (void) init:(CDVInvokedUrlCommand*)command
{
    NSDictionary *dictFrame=[command argumentAtIndex:0];
    float x=[[dictFrame valueForKey:@"x"] floatValue];
    float y=[[dictFrame objectForKey:@"y"] floatValue];
    float width=[[dictFrame objectForKey:@"width"] floatValue];
    float height=[[dictFrame objectForKey:@"height"] floatValue];
    frameTextView = CGRectMake(x, y, width, height);
    textView=[[UITextView alloc] initWithFrame:frameTextView];
    [textView.layer setBorderColor:[[[UIColor blackColor] colorWithAlphaComponent:0.8] CGColor]];
    [textView.layer setBorderWidth:1.0];
    textView.layer.cornerRadius = 5;
    textView.center=CGPointMake(self.webView.frame.size.width/2, y);
    textView.backgroundColor=[UIColor whiteColor];
    [self.viewController.view addSubview:textView];
    
//    UITextField *textField=[[UITextField alloc] initWithFrame:CGRectMake(0, y-100, width, 44)];
//    textField.center=CGPointMake(self.webView.frame.size.width/2, y-100);
//    [textField setBackgroundColor:[UIColor greenColor]];
//    [self.viewController.view addSubview:textField];
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:@"OK"];
    [commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}
-(void) setFrame:(CDVInvokedUrlCommand*)command
{
    NSDictionary *dictFrame=[command argumentAtIndex:0];
    float x=[[dictFrame valueForKey:@"x"] floatValue];
    float y=[[dictFrame objectForKey:@"y"] floatValue];
    float width=[[dictFrame objectForKey:@"width"] floatValue];
    float height=[[dictFrame objectForKey:@"height"] floatValue];
    frameTextView = CGRectMake(x, y, width, height);
    [textView setFrame:frameTextView];
    textView.center=CGPointMake(self.webView.frame.size.width/2, y);
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:@"OK"];
    
    
    
    
    [commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}
-(void) getValueTextView:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = [command callbackId];
    NSString* content = textView.text;
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:content];
    
    [commandDelegate sendPluginResult:result callbackId:callbackId];
}
-(void) hidden:(CDVInvokedUrlCommand*)command
{
    textView.hidden=YES;
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:@"OK"];

    [commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}
-(void) show:(CDVInvokedUrlCommand*)command
{
    textView.hidden=NO;
    NSDictionary *dictFrame=[command argumentAtIndex:0];
    float x=[[dictFrame valueForKey:@"x"] floatValue];
    float y=[[dictFrame objectForKey:@"y"] floatValue];
    float width=[[dictFrame objectForKey:@"width"] floatValue];
    float height=[[dictFrame objectForKey:@"height"] floatValue];
    frameTextView = CGRectMake(x, y, width, height);
    [textView setFrame:frameTextView];
    textView.center=CGPointMake(self.webView.frame.size.width/2, y);
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:@"OK"];
    [commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}
-(void) clearText:(CDVInvokedUrlCommand*)command
{
    textView.text=@"";
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:@"OK"];
    
    [commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}
-(void) destroy:(CDVInvokedUrlCommand*)command
{
    [textView removeFromSuperview];
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:@"OK"];
    
    
    
    
    [commandDelegate sendPluginResult:result callbackId:[command callbackId]];
    
}
@end