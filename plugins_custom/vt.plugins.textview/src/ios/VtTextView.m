#import "TextView.h"

@implementation VtTextView
@synthesize commandDelegate;

-(void) initWithFrame : (CDVInvokedUrlCommand*) command {
    NSDictionary *dictFrame = [command argumentAtIndex : 0];
    float x = [[dictFrame valueForKey : @"x"] floatValue];
    float y = [[dictFrame objectForKey : @"y"] floatValue];
    float width = [[dictFrame objectForKey : @"width"] floatValue];
    float height = [[dictFrame objectForKey : @"height"] floatValue];
    frameTextView = CGRectMake(x, y, width, height);
    textView = [[UITextView alloc] initWithFrame : frameTextView];
    [textView.layer setBorderColor : [[[UIColor blackColor] colorWithAlphaComponent : 0.8] CGColor]];
    [textView.layer setBorderWidth : 1.0];
    textView.layer.cornerRadius = 5;
    textView.center = CGPointMake(self.webView.frame.size.width / 2, y);
    textView.backgroundColor = [UIColor whiteColor];
    textView.delegate = self;
    [self.webView addSubview : textView];
    UIPanGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget : self action : @selector(panGesture :)];
    panGesture.delegate = self;
    [self.viewController.view addGestureRecognizer : panGesture];

    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];

    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}

-(void) initWithID : (CDVInvokedUrlCommand*) command {
    NSDictionary *dictFrame = [command argumentAtIndex : 0];
    float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().bottom+5",] [dictFrame objectForKey : @"id"]] intValue];
    frame.origin.y = pos;
    float width = [[dictFrame objectForKey : @"width"] floatValue];
    float height = [[dictFrame objectForKey : @"height"] floatValue];
    textView = [[UITextView alloc] initWithFrame : CGRectMake(0, pos, width, height)];
    textView.center = CGPointMake(self.webView.frame.size.width / 2, pos);
    
    [textView.layer setBorderColor : [[[UIColor blackColor] colorWithAlphaComponent : 0.8] CGColor]];
    [textView.layer setBorderWidth : 1.0];
    textView.layer.cornerRadius = 5;
    
    textView.backgroundColor = [UIColor whiteColor];
    textView.delegate = self;
    [self.webView addSubview : textView];
    UIPanGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget : self action : @selector(panGesture :)];
    panGesture.delegate = self;
    [self.viewController.view addGestureRecognizer : panGesture];

    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];

    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}

-(void) keyboardWasShown : (NSNotification*) aNotification {

    NSDictionary* info = [aNotification userInfo];
    CGSize kbSize = [[info objectForKey : UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;

    //    CGRect frame=textView.frame;
    //    frame.origin.y=[UIScreen mainScreen].bounds.size.height-kbSize.height-frame.size.height;

    [UIView animateWithDuration : 0.2 animations : ^{
        CGRect frame = textView.frame;
        frame.origin.y = [UIScreen mainScreen].bounds.size.height - kbSize.height - frame.size.height;
        [textView setFrame : frame];
    }
    ];
}

-(void) keyboardWillBeHidden : (NSNotification*) aNotification {
    //    NSDictionary* info = [aNotification userInfo];
    //    CGSize kbSize = [[info objectForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    //    
    //    //    UIEdgeInsets contentInsets = UIEdgeInsetsMake(0.0, 0.0, kbSize.height, 0.0);
    //    [UIView animateWithDuration:1.0 animations:^{
    //        CGRect frame=textView.frame;
    //        //        CGRect rect=[UIScreen mainScreen].bounds.size.width;
    //        frame.origin.y=[UIScreen mainScreen].bounds.size.height-kbSize.height;
    //        [textView setFrame:frame];
    //    }];
}

-(void) textViewDidBeginEditing : (UITextView *) textView {
    [[NSNotificationCenter defaultCenter] addObserver : self
    selector : @selector(keyboardWasShown :)
    name : UIKeyboardDidShowNotification object : nil];

    [[NSNotificationCenter defaultCenter] addObserver : self
    selector : @selector(keyboardWillBeHidden :)
    name : UIKeyboardWillHideNotification object : nil];
}

-(void) textViewDidEndEditing : (UITextView *) textView {
    [textView resignFirstResponder];
}
//To enable gesture recognizer

-(BOOL) gestureRecognizer : (UIGestureRecognizer *) gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer : (UIGestureRecognizer *) otherGestureRecognizer {
    return YES;
}

-(void) panGesture : (UIPanGestureRecognizer*) panGesture {
    CGRect frame = textView.frame;

    if (panGesture.state == UIGestureRecognizerStateBegan) {
    }
    if (panGesture.state == UIGestureRecognizerStateChanged) {
        float pos = [[self.webView stringByEvaluatingJavaScriptFromString : @"document.getElementById('fbNoiDung').getBoundingClientRect().bottom+5"] intValue];
        frame.origin.y = pos;
        [textView setFrame : frame];
        //        textView.text=[NSString stringWithFormat:@"%f",self.webView.contentScaleFactor];
    }
    if (panGesture.state == UIGestureRecognizerStateEnded) {
        [self.webView stringByEvaluatingJavaScriptFromString : @"document.getElementById('FeedBackContent').getAttribute('direction')=z"];
    }
}

-(void) setFrame : (CDVInvokedUrlCommand*) command {
    NSDictionary *dictFrame = [command argumentAtIndex : 0];
    float x = [[dictFrame valueForKey : @"x"] floatValue];
    float y = [[dictFrame objectForKey : @"y"] floatValue];
    float width = [[dictFrame objectForKey : @"width"] floatValue];
    float height = [[dictFrame objectForKey : @"height"] floatValue];
    frameTextView = CGRectMake(x, y, width, height);
    [textView setFrame : frameTextView];
    textView.center = CGPointMake(self.webView.frame.size.width / 2, y);

    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];




    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}

-(void) getValueTextView : (CDVInvokedUrlCommand*) command {
    NSString* callbackId = [command callbackId];
    NSString* content = textView.text;
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : content];

    [commandDelegate sendPluginResult : result callbackId : callbackId];
}

-(void) hidden : (CDVInvokedUrlCommand*) command {
    textView.hidden = YES;

    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];

    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}

-(void) show : (CDVInvokedUrlCommand*) command {
    textView.hidden = NO;
    NSDictionary *dictFrame = [command argumentAtIndex : 0];
    float x = [[dictFrame valueForKey : @"x"] floatValue];
    float y = [[dictFrame objectForKey : @"y"] floatValue];
    float width = [[dictFrame objectForKey : @"width"] floatValue];
    float height = [[dictFrame objectForKey : @"height"] floatValue];
    frameTextView = CGRectMake(x, y, width, height);
    [textView setFrame : frameTextView];
    textView.center = CGPointMake(self.webView.frame.size.width / 2, y);
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];
    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}

-(void) clearText : (CDVInvokedUrlCommand*) command {
    textView.text = @"";
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];

    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}

-(void) destroy : (CDVInvokedUrlCommand*) command {
    [textView removeFromSuperview];
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];




    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];

}
@end