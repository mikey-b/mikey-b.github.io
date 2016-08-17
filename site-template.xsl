<xsl:stylesheet version="1.0"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
   xmlns:html="http://www.w3.org/1999/xhtml"
   xmlns="http://www.w3.org/1999/xhtml"
   exclude-result-prefixes="xsl html"
>
	<xsl:output method="html" version="1.0" omit-xml-declaration="no" doctype-system="about:legacy-compat"/>

	<!-- This is the "Fix for IE" based on the example in W3C's FAQs: http://www.w3.org/MarkUp/2004/xhtml-faq#ie -->

	<xsl:template match="/html:html/html:head">
		<xsl:copy>
			<xsl:apply-templates select="@*"/>
			<!-- Workaround for Microsoft Bug #s 636728 and 572123  X-UA-Compatible meta is ignored when inside conditional comments -->
			<meta http-equiv="X-UA-Compatible" content="IE=9"/>
			<style>
				body { font-family: georgia; background: url(http://i143.photobucket.com/albums/r131/sushigurl92/Backgrounds/th_pika1.jpg); }
				h1,h2 { font-variant:small-caps; }
				.main { background: white; width: 800px; border: 1px solid black; border-radius: 10px; border: 3px solid black; margin-left: auto;  margin-right: auto; }
				.header { height: 100px; background: black url(http://thumbs.dreamstime.com/thumblarge_702/1342801623J7VAmO.jpg); border-bottom: 2px solid grey; }
				h1 { color: white; margin: 0; font-size: 90px; text-align: center; text-shadow: 0 0 10px black; }
				.menu { margin: 5px; border-bottom: 1px dashed grey; height: 25px }
				.menu a { }
				.menu .right-aligned { float: right; }
				.content { padding: 25px }
				.feedback { }
				.footer { border-top: 1px solid black; padding: 5px; text-align: center; }
				.feedback .fb-comments { margin-left: auto;  margin-right: auto; }
				.feedback h1 { color: white; background: url(http://www.webmastertoolkits.com/images/gradient-black-grey.png) 100% 100px; border-top: 2px solid grey; border-bottom: 2px solid grey; padding: 5px; }
			</style>
			<script>
				if (typeof String.prototype.startsWith != 'function') {
					String.prototype.startsWith = function (str){
						return this.slice(0, str.length) == str;
					};
				}
				if (typeof String.prototype.endsWith != 'function') {
					String.prototype.endsWith = function (str){
						return this.slice(-str.length) == str;
					};
				}
			</script>
			<xsl:apply-templates select="node()"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/html:html/html:body">
		<div id="fb-root"></div>
		<script>
		window.onload = function () {
			var t = document.getElementById('fb-comment-box');
			if (t) {
				var uri = location.href;
				uri = uri.replace('http://','');
				if (!uri.startsWith('www.')) uri = "www." + uri;
				t.setAttribute('data-href', uri);
			}	
				(function(d, s, id) {  
				var js, fjs = d.getElementsByTagName(s)[0]; 
				if (d.getElementById(id)) return; 
				js = d.createElement(s); 
				js.id = id;
				js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		};
		</script>
		<xsl:copy>
			<xsl:apply-templates select="@*"/>
			<div class="main">
				<div class="header">
					<h1>Segfault</h1>
				</div>
				<div class="menu">
					<a href="/">Index</a> /
					<a href="#">Contact</a> /
					<a href="#">About Me</a>
				</div>
				<div class="content">
					<xsl:apply-templates select="node()"/>
				</div>
				<div class="feedback">
					<div class="fb-like" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false"></div><br/>
					<h1>Feedback</h1>
					<div id="fb-comment-box" class="fb-comments" data-width="700" data-num-posts="10"></div>
				</div>
				<div class="footer">
					2013&#169; Segfault, Mike Brown, All Rights Reserved. <a href="http://validator.w3.org/check?uri=referer">W3C</a>
				</div>
			</div>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
