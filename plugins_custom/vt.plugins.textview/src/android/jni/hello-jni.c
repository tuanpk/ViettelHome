#include <string.h>
#include <jni.h>

jstring
Java_com_example_plugin_Hello_stringFromJNI( JNIEnv* env,
                                                  jobject thiz )
{
    return (*env)->NewStringUTF(env, "Hello from JNI ! Android & NDK");
}
