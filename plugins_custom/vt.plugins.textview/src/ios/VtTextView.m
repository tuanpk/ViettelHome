#import "VtTextView.h"

@implementation VtTextView
@synthesize commandDelegate;

-(void) initWithID:(NSString*) idElement tagView:(NSInteger) tagView
{
    float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",idElement]] floatValue];
    float width=[[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').clientWidth",idElement]] floatValue];
    float height=[[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').clientHeight",idElement]] floatValue];
    UITextView *textView = [[UITextView alloc] initWithFrame : CGRectMake(0, pos, width, height)];
    textView.center = CGPointMake(self.webView.frame.size.width / 2, pos+textView.frame.size.height/2);
    [textView.layer setBorderColor : [[[UIColor blackColor] colorWithAlphaComponent : 0.8] CGColor]];
    [textView.layer setBorderWidth : 1.0];
    textView.layer.cornerRadius = 5;
    textView.backgroundColor = [UIColor whiteColor];
    textView.tag=tagView;
    textView.text=[NSString stringWithFormat:@"%li",(long)tagView];
    textView.delegate = self;
    [self.viewController.view addSubview: textView];
    [dictTextViews setObject:textView forKey:idElement];
}
//Moi trang se co cac text view. moi textview se co cac id, truyen sang trang moi se co cac id moi va can giu lai id hien tai. do do ta can cac bien luu tru nhu sau: arrIDs luu tru cac id hien tai, arrCurId : so id hien tai cua trang, dictTextViews: luu tru cac text view . Khi quay lai trang cu plugin se tu xoa cac id cua trang hien tai dua vao so id cua trang hien tai la arrCurId.
-(void) initWithListID:(CDVInvokedUrlCommand*) command
{
    if (!arrIDs) arrIDs=[[NSMutableArray alloc] init];
    if (!dictTextViews) dictTextViews=[[NSMutableDictionary alloc] init];
    if (!arrCurId) arrCurId=[[NSMutableArray alloc] init];
        //An nhung id o trang truoc
    for (int i=0;i<arrCurId.count;i++)
    {
        UITextView *textView=[dictTextViews objectForKey:[arrCurId objectAtIndex:i]];
        textView.hidden=YES;
    }
    NSDictionary *dictCommand=[command argumentAtIndex : 0];
    arrCurId= [[NSArray arrayWithObject:[dictCommand objectForKey:@"listID"]] objectAtIndex:0];
    isScroll=[[dictCommand objectForKey:@"isScroll"] boolValue];
    
    for (int i=0; i<arrCurId.count ; i++)
    {
        idElement=[arrCurId objectAtIndex:i];
        [arrIDs addObject:idElement];
        [self initWithID:idElement tagView:arrIDs.count-1];
    }
    
    if(isScroll)
    {
        if(!panGesture)
        {
            panGesture = [[UIPanGestureRecognizer alloc] initWithTarget : self action : @selector(panGesture:)];
            panGesture.delegate = self;
            [self.webView addGestureRecognizer : panGesture];
        }
    }
    if(!tapGesture)
    {
        tapGesture=[[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapGesture:)];
        tapGesture.delegate=self;
        [self.webView addGestureRecognizer:tapGesture];
        [[NSNotificationCenter defaultCenter] addObserver : self
                                                 selector : @selector(keyboardWasShown :)
                                                     name : UIKeyboardWillShowNotification object : nil];
    }
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus : CDVCommandStatus_OK
                               messageAsString : @"OK"];
    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}
-(void) textViewShouldBeginEditing : (UITextView *) textView
{
    idElement=[arrIDs objectAtIndex:textView.tag];
}
-(void) keyboardWasShown : (NSNotification*) aNotification
{
    NSDictionary* info = [aNotification userInfo];
    CGSize kbSize = [[info objectForKey : UIKeyboardFrameBeginUserInfoKey] CGRectValue].size;
    UITextView *textView=[dictTextViews objectForKey:idElement];
    float offsetHeight=kbSize.height-([UIScreen mainScreen].bounds.size.height-textView.frame.origin.y-textView.frame.size.height);
    if (offsetHeight>0)
    {
        [self.webView.scrollView setContentOffset:CGPointMake(0, offsetHeight)];
        [self.webView.scrollView setContentSize:CGSizeMake(self.webView.frame.size.width, self.webView.frame.size.height+kbSize.height-offsetHeight)];
        CGRect frame = textView.frame;
        float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",idElement]] floatValue];
        frame.origin.y = pos;
        textView.frame= frame;
        for (int i=0; i<arrCurId.count; i++)
        {
            if ([arrCurId objectAtIndex:i]!=idElement)
            {
                textView=[dictTextViews objectForKey:[arrCurId objectAtIndex:i]];
                CGRect frame = textView.frame;
                pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",[arrCurId objectAtIndex:i]]] floatValue];
                frame.origin.y = pos;
                textView.frame= frame;
            }
        }
    }
}
//To enable gesture recognizer

-(BOOL) gestureRecognizer : (UIGestureRecognizer *) gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer : (UIGestureRecognizer *) otherGestureRecognizer {
    return YES;
}
-(void) tapGesture:(UITapGestureRecognizer*) tapGeture
{
    [UIView animateWithDuration : 0.5 animations : ^{
        for (int i=0; i<arrCurId.count; i++)
        {
            UITextView *textView=[dictTextViews objectForKey:[arrCurId objectAtIndex:i]];
                [self.webView.scrollView setContentOffset:CGPointMake(0, 0)];
                [self.webView.scrollView setContentSize:CGSizeMake(self.webView.frame.size.width, self.webView.frame.size.height)];
            
                float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",[arrCurId objectAtIndex:i]]] floatValue];
                CGRect frame = textView.frame;
                frame.origin.y = pos;
                textView.frame= frame;
            [textView resignFirstResponder];
            }
        }
     ];
}
-(void) panGesture : (UIPanGestureRecognizer*) panGes
{
    if (isScroll)
    {
        if (panGes.state == UIGestureRecognizerStateBegan)
        {
            
        }
        if (panGes.state == UIGestureRecognizerStateChanged) {
            for (int i=0; i<arrCurId.count; i++)
            {
                UITextView *textView=[dictTextViews objectForKey:[arrCurId objectAtIndex:i]];
                float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",[arrCurId objectAtIndex:i]]] floatValue];
                CGRect frame = textView.frame;
                frame.origin.y = pos;
                textView.frame= frame;
            }
        }
        if (panGes.state == UIGestureRecognizerStateEnded)
        {
            
        }
    }
}

-(void) getValueTextView : (CDVInvokedUrlCommand*) command {
    NSString* callbackId = [command callbackId];
    UITextView *textView= [dictTextViews objectForKey:idElement];
    NSString* content =textView.text;
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : content];

    [commandDelegate sendPluginResult : result callbackId : callbackId];
}
-(void) setText:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus : CDVCommandStatus_OK
                               messageAsString : @"OK"];
    
    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}
//plugin ho tro khi hien thi text view lai khi back. se tu huy nhung text view o trang cu va hien text view o trang hien tai. ta thiet lap option: ['idname','idname']
-(void) show : (CDVInvokedUrlCommand*) command
{
    arrCurId= [[NSArray arrayWithObject:[command argumentAtIndex : 0]] objectAtIndex:0];
    //muon xoa nhung id o trang cu ta lay ra index cao nhat cua id muon hien thi trong mang arrIDs da luu
    //B1:lay index ma id cua no trong arrIDShows co gia tri lon nhat trong mang arrIDs
    int indexMax=0;
    NSUInteger indexCur=[arrIDs indexOfObject:[arrCurId objectAtIndex:0]];
    for (int i=1; i<arrCurId.count; i++)
    {
        NSUInteger indexTem=[arrIDs indexOfObject:[arrCurId objectAtIndex:i]];
        if (indexTem>indexCur) indexMax=i;
    }
    //B2:lap va xoa nhung text view voi nhung id sau do
    for (NSUInteger i=[arrIDs indexOfObject:[arrCurId objectAtIndex:indexMax]]+1; i<arrIDs.count; i++) {
        idElement=[arrIDs objectAtIndex:i];
        [[dictTextViews objectForKey:idElement] removeFromSuperview];
        [dictTextViews removeObjectForKey:idElement];
        [arrIDs removeObject:idElement];
    }
    //B3: hien thi nhung id hien tai duoc truyen vao
    for (int i=0; i<arrCurId.count; i++)
    {
            idElement=[arrCurId objectAtIndex:i];
            UITextView *textView=[dictTextViews objectForKey:idElement];
            textView.hidden=NO;
    }
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];
    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}

-(void) hide : (CDVInvokedUrlCommand*) command
{
    NSArray *arrIDHides= [[NSArray arrayWithObject:[command argumentAtIndex : 0]] objectAtIndex:0];
    for (int i=0; i<arrIDHides.count; i++)
    {
        idElement=[arrIDHides objectAtIndex:i];
        UITextView *textView=[dictTextViews objectForKey:idElement];
        textView.hidden=YES;
    }
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus : CDVCommandStatus_OK
                               messageAsString : @"OK"];
    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}
-(void) scrollContent: (CDVInvokedUrlCommand*) command
{
    for (int i=0; i<arrCurId.count; i++)
    {
        UITextView *textView=[dictTextViews objectForKey:[arrCurId objectAtIndex:i]];
        float pos = [[self.webView stringByEvaluatingJavaScriptFromString :[NSString stringWithFormat:@"document.getElementById('%@').getBoundingClientRect().top",[arrCurId objectAtIndex:i]]] floatValue];
        CGRect frame = textView.frame;
        frame.origin.y = pos;
        textView.frame= frame;
    }
}
-(void) destroy : (CDVInvokedUrlCommand*) command
{
    for (NSUInteger i=0; i<arrIDs.count; i++)
    {
        idElement=[arrIDs objectAtIndex:i];
        [[dictTextViews objectForKey:idElement] removeFromSuperview];
        [dictTextViews removeObjectForKey:idElement];
    }
    arrIDs=NULL;
    CDVPluginResult* result = [CDVPluginResult
            resultWithStatus : CDVCommandStatus_OK
            messageAsString : @"OK"];
    [commandDelegate sendPluginResult : result callbackId : [command callbackId]];
}
@end