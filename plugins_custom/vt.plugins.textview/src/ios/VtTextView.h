#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>

@interface VtTextView : CDVPlugin
{
    NSMutableDictionary *dictTextViews;
    NSMutableArray *arrIDs;
    NSMutableArray *arrCurId;
    CGRect frameTextView;
    NSString *idElement;
    BOOL isScroll;
    UIPanGestureRecognizer *panGesture;
    UITapGestureRecognizer *tapGesture;
}
-(void) initWithListID:(CDVInvokedUrlCommand*) command;
-(void) setFrame:(CDVInvokedUrlCommand*)command;
-(void) hide:(CDVInvokedUrlCommand*)command;
-(void) show:(CDVInvokedUrlCommand*)command;
-(void) destroy:(CDVInvokedUrlCommand*)command;
-(void) getText:(CDVInvokedUrlCommand*)command;
-(void) setText:(CDVInvokedUrlCommand*)command;

@end