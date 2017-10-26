
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v1.5.6.RELEASE)

2017-10-26 10:37:00.106  INFO 3056 --- [           main] com.ai.ipu.archivement.Application       : Starting Application on zhouxiaofei with PID 3056 (E:\IpuCode\ipuapp\achievements\out\artifacts\gs_spring_boot_jar\gs-spring-boot.jar started by Administrator in E:\IpuCode\ipuapp\achievements\out\artifacts\gs_spring_boot_jar)
2017-10-26 10:37:00.121  INFO 3056 --- [           main] com.ai.ipu.archivement.Application       : No active profile set, falling back to default profiles: default
2017-10-26 10:37:00.215  INFO 3056 --- [           main] ationConfigEmbeddedWebApplicationContext : Refreshing org.springframework.boot.context.embedded.AnnotationConfigEmbeddedWebApplicationContext@52e677af: startup date [Thu Oct 26 10:37:00 CST 2017]; root of context hierarchy
2017-10-26 10:37:03.668  INFO 3056 --- [           main] s.b.c.e.t.TomcatEmbeddedServletContainer : Tomcat initialized with port(s): 9080 (http)
2017-10-26 10:37:03.715  INFO 3056 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2017-10-26 10:37:03.715  INFO 3056 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet Engine: Apache Tomcat/8.5.16
2017-10-26 10:37:04.090  INFO 3056 --- [ost-startStop-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2017-10-26 10:37:04.090  INFO 3056 --- [ost-startStop-1] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 3891 ms
2017-10-26 10:37:04.430  INFO 3056 --- [ost-startStop-1] o.s.b.w.servlet.ServletRegistrationBean  : Mapping servlet: 'dispatcherServlet' to [/]
2017-10-26 10:37:04.430  INFO 3056 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'metricsFilter' to: [/*]
2017-10-26 10:37:04.430  INFO 3056 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'characterEncodingFilter' to: [/*]
2017-10-26 10:37:04.430  INFO 3056 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'webRequestLoggingFilter' to: [/*]
2017-10-26 10:37:04.430  INFO 3056 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'applicationContextIdFilter' to: [/*]
2017-10-26 10:37:05.280  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/login/index],methods=[POST]}" onto public com.ailk.common.data.IData com.ai.ipu.archivement.controller.AccountController.index(java.lang.String,java.lang.String,javax.servlet.http.HttpServletRequest) throws java.lang.Exception
2017-10-26 10:37:05.280  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/challenge]}" onto public java.lang.String com.ai.ipu.archivement.controller.DealAchieveController.searchachieve(javax.servlet.http.HttpServletRequest,java.lang.String,java.lang.String)
2017-10-26 10:37:05.280  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/finished]}" onto public java.lang.String com.ai.ipu.archivement.controller.DealAchieveController.updateuseraid(javax.servlet.http.HttpServletRequest,java.lang.String)
2017-10-26 10:37:05.280  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/quit]}" onto public java.lang.String com.ai.ipu.archivement.controller.DealAchieveController.deleteuseraid(javax.servlet.http.HttpServletRequest,java.lang.String)
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/firstpage]}" onto public java.lang.String com.ai.ipu.archivement.controller.IndexController.firstpage(java.util.Map<java.lang.String, java.lang.String>,javax.servlet.http.HttpServletRequest) throws java.lang.Exception
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/loginout]}" onto public java.lang.String com.ai.ipu.archivement.controller.IndexController.loginout(javax.servlet.http.HttpServletRequest)
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/achieve]}" onto public java.util.List<com.ai.ipu.archivement.core.context.AchieveData> com.ai.ipu.archivement.controller.SearchAchieveController.searchachieve()
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/achNum]}" onto public java.util.List<com.ai.ipu.archivement.core.context.UserAchNumData> com.ai.ipu.archivement.controller.SearchAchieveController.searchUserAchNum()
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/myach_ed]}" onto public java.util.List<com.ai.ipu.archivement.core.context.UserAchData> com.ai.ipu.archivement.controller.SearchAchieveController.MyAchieve_ed(javax.servlet.http.HttpServletRequest)
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/myach_ing]}" onto public java.util.List<com.ai.ipu.archivement.core.context.UserAchData> com.ai.ipu.archivement.controller.SearchAchieveController.MyAchieve_ing(javax.servlet.http.HttpServletRequest)
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/searchAchById]}" onto public java.lang.String com.ai.ipu.archivement.controller.SearchAchieveController.searchAchById(java.lang.String,java.lang.String,java.util.Map<java.lang.String, java.lang.String>)
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/]}" onto public java.lang.String com.ai.ipu.archivement.HelloController.login()
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/CoreController]}" onto public void com.ai.ipu.archivement.wechat.controller.CoreController.corecontroller(javax.servlet.http.HttpServletRequest,javax.servlet.http.HttpServletResponse) throws java.io.IOException
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/wxconfig]}" onto public com.ailk.common.data.IData com.ai.ipu.archivement.wechat.controller.WxconfigController.wxconfig()
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error]}" onto public org.springframework.http.ResponseEntity<java.util.Map<java.lang.String, java.lang.Object>> org.springframework.boot.autoconfigure.web.BasicErrorController.error(javax.servlet.http.HttpServletRequest)
2017-10-26 10:37:05.296  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error],produces=[text/html]}" onto public org.springframework.web.servlet.ModelAndView org.springframework.boot.autoconfigure.web.BasicErrorController.errorHtml(javax.servlet.http.HttpServletRequest,javax.servlet.http.HttpServletResponse)
2017-10-26 10:37:05.359  INFO 3056 --- [           main] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-10-26 10:37:05.405  INFO 3056 --- [           main] s.w.s.m.m.a.RequestMappingHandlerAdapter : Looking for @ControllerAdvice: org.springframework.boot.context.embedded.AnnotationConfigEmbeddedWebApplicationContext@52e677af: startup date [Thu Oct 26 10:37:00 CST 2017]; root of context hierarchy
2017-10-26 10:37:05.546  WARN 3056 --- [           main] ationConfigEmbeddedWebApplicationContext : Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'beetlConfig' defined in com.ai.ipu.archivement.Application: Invocation of init method failed; nested exception is java.lang.RuntimeException: 初始化失败
2017-10-26 10:37:05.546  INFO 3056 --- [           main] o.apache.catalina.core.StandardService   : Stopping service [Tomcat]
2017-10-26 10:37:05.655  INFO 3056 --- [           main] utoConfigurationReportLoggingInitializer : 

Error starting ApplicationContext. To display the auto-configuration report re-run your application with 'debug' enabled.
2017-10-26 10:37:05.687 ERROR 3056 --- [           main] o.s.boot.SpringApplication               : Application startup failed

org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'beetlConfig' defined in com.ai.ipu.archivement.Application: Invocation of init method failed; nested exception is java.lang.RuntimeException: 初始化失败
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1628) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:555) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:483) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.AbstractBeanFactory$1.getObject(AbstractBeanFactory.java:306) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:230) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:302) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:197) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.preInstantiateSingletons(DefaultListableBeanFactory.java:761) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:867) ~[spring-context-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:543) ~[spring-context-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.boot.context.embedded.EmbeddedWebApplicationContext.refresh(EmbeddedWebApplicationContext.java:122) ~[spring-boot-1.5.6.RELEASE.jar:1.5.6.RELEASE]
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:693) [spring-boot-1.5.6.RELEASE.jar:1.5.6.RELEASE]
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:360) [spring-boot-1.5.6.RELEASE.jar:1.5.6.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:303) [spring-boot-1.5.6.RELEASE.jar:1.5.6.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1118) [spring-boot-1.5.6.RELEASE.jar:1.5.6.RELEASE]
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1107) [spring-boot-1.5.6.RELEASE.jar:1.5.6.RELEASE]
	at com.ai.ipu.archivement.Application.main(Application.java:19) [gs-spring-boot.jar:na]
Caused by: java.lang.RuntimeException: 初始化失败
	at org.beetl.core.GroupTemplate.<init>(GroupTemplate.java:140) ~[beetl-core-2.2.3.jar:na]
	at org.beetl.ext.spring.BeetlGroupUtilConfiguration.initGroupTemplate(BeetlGroupUtilConfiguration.java:220) ~[beetl-core-2.2.3.jar:na]
	at org.beetl.ext.spring.BeetlGroupUtilConfiguration.init(BeetlGroupUtilConfiguration.java:94) ~[beetl-core-2.2.3.jar:na]
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:1.8.0_121]
	at sun.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:1.8.0_121]
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:1.8.0_121]
	at java.lang.reflect.Method.invoke(Unknown Source) ~[na:1.8.0_121]
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeCustomInitMethod(AbstractAutowireCapableBeanFactory.java:1758) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1695) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1624) ~[spring-beans-4.3.10.RELEASE.jar:4.3.10.RELEASE]
	... 16 common frames omitted
Caused by: java.lang.NullPointerException: null
	at org.beetl.core.resource.ClasspathResourceLoader.init(ClasspathResourceLoader.java:222) ~[beetl-core-2.2.3.jar:na]
	at org.beetl.core.GroupTemplate.initResourceLoader(GroupTemplate.java:152) ~[beetl-core-2.2.3.jar:na]
	at org.beetl.core.GroupTemplate.<init>(GroupTemplate.java:136) ~[beetl-core-2.2.3.jar:na]
	... 25 common frames omitted

