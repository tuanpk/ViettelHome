#import "VtTextView.h"

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
    UITapGestureRecognizer *tapGesture=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapGesture:)];
    panGesture.delegate = self;
    tapGesture.delegate=self;
    [self.viewController.view addGestureRecognizer : panGesture];
    [self.viewController.view addGestureRecognizer:tapGesture];
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];

    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}
-(void) initWithID : (CDVInvokedUrlCommand*) command {
    NSDictionary *dictFrame = [command argumentAtIndex : 0];
    idElement=[dictFrame objectForKey : @"id"];
    float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",idElement]] floatValue];
    float width=[[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').clientWidth",idElement]] floatValue];
    float height=[[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').clientHeight",idElement]] floatValue];
    textView = [[UITextView alloc] initWithFrame : CGRectMake(0, pos, width, height)];
    textView.center = CGPointMake(self.webView.frame.size.width / 2, pos+textView.frame.size.height/2);
    [textView.layer setBorderColor : [[[UIColor blackColor] colorWithAlphaComponent : 0.8] CGColor]];
    [textView.layer setBorderWidth : 1.0];
    textView.layer.cornerRadius = 5;
    textView.backgroundColor = [UIColor whiteColor];
    textView.delegate = self;
    [textView setTag:1];
    [self.webView setTag:2];
    [self.viewController.view setTag:3];
    [self.webView.scrollView setTag:4];
    [self.viewController.view addSubview: textView];
    UIPanGestureRecognizer *panGesture = [[UIPanGestureRecognizer alloc] initWithTarget : self action : @selector(panGesture:)];
    UITapGestureRecognizer *tapGesture=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapGesture:)];
    panGesture.delegate = self;
    tapGesture.delegate=self;
    [self.webView addGestureRecognizer : panGesture];
    [self.webView addGestureRecognizer:tapGesture];
 
    [[NSNotificationCenter defaultCenter] addObserver : self
                                             selector : @selector(keyboardWasShown :)
                                                 name : UIKeyboardWillShowNotification object : nil];
//    [self.webView loadHTMLString:@"<script type='text/javascript'>alert('ok');</script>" baseURL:nil];
    
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];
    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}

-(void) keyboardWasShown : (NSNotification*) aNotification
{
    NSDictionary* info = [aNotification userInfo];
    CGSize kbSize = [[info objectForKey : UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    
    float offsetHeight=kbSize.height-([UIScreen mainScreen].bounds.size.height-textView.frame.origin.y-textView.frame.size.height);
    if (offsetHeight>0)
    {
        [self.webView.scrollView setContentOffset:CGPointMake(0, offsetHeight)];
        [self.webView.scrollView setContentSize:CGSizeMake(self.webView.frame.size.width, self.webView.frame.size.height+kbSize.height-offsetHeight)];
        float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",idElement]] floatValue];
        CGRect frame = textView.frame;
        frame.origin.y = pos;
        textView.frame= frame;
    }
}

-(void) textViewDidBeginEditing : (UITextView *) textView
{
    
}
//To enable gesture recognizer

-(BOOL) gestureRecognizer : (UIGestureRecognizer *) gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer : (UIGestureRecognizer *) otherGestureRecognizer {
    return YES;
}
-(void) tapGesture:(UITapGestureRecognizer*) tapGeture
{
    [UIView animateWithDuration : 0.5 animations : ^{
        [self.webView.scrollView setContentOffset:CGPointMake(0, 0)];
        [self.webView.scrollView setContentSize:CGSizeMake(self.webView.frame.size.width, self.webView.frame.size.height)];
        float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",idElement]] floatValue];
        CGRect frame = textView.frame;
        frame.origin.y = pos;
        textView.frame= frame;
        [textView resignFirstResponder];
    }
     ];
}
-(void) panGesture : (UIPanGestureRecognizer*) panGesture {
    CGRect frame = textView.frame;

    if (panGesture.state == UIGestureRecognizerStateBegan) {
    }
    if (panGesture.state == UIGestureRecognizerStateChanged) {
        float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",idElement]] floatValue];
        frame.origin.y = pos;
        [textView setFrame : frame];
    }
    if (panGesture.state == UIGestureRecognizerStateEnded)
    {
        
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

-(void) hide : (CDVInvokedUrlCommand*) command {
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