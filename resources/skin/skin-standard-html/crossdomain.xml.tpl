<%
	//	Read: http://www.adobe.com/devnet/articles/crossdomain_policy_file_spec.html
	//
	//	to specify your own policy override this file (by creating new one) in
	//	you skin implementation.
	//
	
%><%FORMAT: 'xml' %><%FINAL: 'text/xml' %><?xml version="1.0" encoding="utf-8"?>
	<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
	<cross-domain-policy>
		<% // <!--  --> 
		%>
	
		<site-control permitted-cross-domain-policies="none"/>
	
		<!-- Least restrictive policy: -->
		<!--
			<site-control permitted-cross-domain-policies="all"/>
			<allow-access-from domain="*" to-ports="*" secure="false"/>
			<allow-http-request-headers-from domain="*" headers="*" secure="false"/>
		-->
	</cross-domain-policy>
<%/FINAL%><%/FORMAT%>
