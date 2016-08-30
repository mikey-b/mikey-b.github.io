<xsl:stylesheet version="1.0"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
   xmlns:html="http://www.w3.org/1999/xhtml"
   xmlns="http://www.w3.org/1999/xhtml"
   exclude-result-prefixes="xsl html">
	<xsl:output method="html" version="1.0" omit-xml-declaration="no" doctype-system="about:legacy-compat"/>

	<!-- This is the "Fix for IE" based on the example in W3C's FAQs: http://www.w3.org/MarkUp/2004/xhtml-faq#ie -->

	<xsl:template match="/html:html/html:head">
		<xsl:copy>
			<xsl:apply-templates select="@*"/>
			<!-- Workaround for Microsoft Bug #s 636728 and 572123  X-UA-Compatible meta is ignored when inside conditional comments -->
			<meta http-equiv="X-UA-Compatible" content="IE=9"/>
			<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
			<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" type="text/css"/>
			<link rel="stylesheet" href="style.css" type="text/css"/>
			<link rel="stylesheet" href="css/font-awesome.min.css"/>
			<style>
				li a { border-bottom: 2px solid grey; }
				li a:hover { border-bottom: 2px solid black; }
			</style>
<script><![CDATA[
// Make sure the DOM elements are loaded and accounted for
$(document).ready(function() {
  // Match to Bootstraps data-toggle for the modal
  // and attach an onclick event handler
  $('a[data-toggle="modal"]').on('click', function(e) {

    // From the clicked element, get the data-target arrtibute
    // which BS3 uses to determine the target modal
    var target_modal = $(e.currentTarget).data('target');
    // also get the remote content's URL
    var remote_content = e.currentTarget.href;

    // Find the target modal in the DOM
    var modal = $(target_modal);
    // Find the modal's <div class="modal-body"> so we can populate it
    var modalBody = $(target_modal + ' .modal-body');

    // Capture BS3's show.bs.modal which is fires
    // immediately when, you guessed it, the show instance method
    // for the modal is called
    modal.on('show.bs.modal', function () {
            // use your remote content URL to load the modal body
            modalBody.load(remote_content);
        }).modal();
        // and show the modal

    // Now return a false (negating the link action) to prevent Bootstrap's JS 3.1.1
    // from throwing a 'preventDefault' error due to us overriding the anchor usage.
    return false;
  });
});]]>
</script>

<script><![CDATA[
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-83300037-1', 'auto');
  ga('send', 'pageview');
]]>
</script>

			<xsl:apply-templates select="node()"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="/html:html/html:body">
		<xsl:copy>
			<xsl:apply-templates select="@*"/>

<div class="navbar navbar-default navbar-fixed-top" role="navigation" style="background: #F0F0F0">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a href="/" class="navbar-brand">
                <img src="logo.png" width="32" style="display: inline-block"/> Mike's Developer Log</a>
        </div>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li>
                    <a href="about.xhtml">
                        <i class="fa fa-question"></i>
                        <span class="icon-label">About</span>
                    </a>
                </li>
                <li>
                    <a href="portfolio.xhtml">
                        <i class="fa fa-github"></i>
                        <span class="icon-label">Portfolio</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fa fa-envelope-o"></i>
                        <span class="icon-label">Contact</span>
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fa fa-th-list"></i>
                        <span class="icon-label">Archives</span>
                    </a>
                </li>
            </ul>
        </div>
        <!-- /.navbar-collapse -->
    </div>
</div> <!-- /.navbar -->


			<div class="container">
				<div>
					<xsl:apply-templates select="node()"/>
				</div>
			</div>

<footer>
   <div class="container">
      <hr/>
      <div class="row">
         <div class="col-xs-10">
            &#169; 2003-2016 Mike Brown, All Rights Reserved. <a href="http://validator.w3.org/check?uri=referer">W3C</a>
         </div>
         <div class="col-xs-2"><p class="pull-right"><i class="fa fa-arrow-up"></i> <a href="#">Back to top</a></p></div>
      </div>
   </div>
</footer>

		</xsl:copy>
	</xsl:template>

	<xsl:template match="html:newestBlogArticle">
<div id="share" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&#215;</button>
        <h3 id="termsLabel" class="modal-title">Share This Page</h3>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->


	<div class="row">
		<div class="col-md-9">
					<xsl:apply-templates select="document(document('article-list.xml')/articles/article[1]/@href)"/>
		</div>
		<div class="col-md-3">
			<br/>
			<div class="panel panel-default">
			  <div class="panel-heading">Recent Articles</div>
<div class="list-group">
			    <xsl:for-each select="document('article-list.xml')/articles/article">
					<a class="list-group-item">
						<xsl:attribute name="href">/<xsl:value-of select="@href"/></xsl:attribute>
						<i class="fa fa-arrow-right"></i>
						<xsl:value-of select="@title"/><br/><small><xsl:value-of select="@date"/></small></a>
				</xsl:for-each>
</div>

			</div>
		</div>
	</div>

        		<div class="col-md-12 text-right">
					<strong>Share this page: </strong>
                    <ul class="social-network social-circle">
                        <li><a data-toggle="modal" data-target="#share" class="icoFacebook" title="Facebook">
							<xsl:attribute name="href">https://www.facebook.com/sharer/sharer.php?u=http://www.segfault.co.uk/<xsl:value-of select="document('article-list.xml')/articles/article[1]/@href"/></xsl:attribute>
							<i class="fa fa-facebook"></i></a></li>
                        <li><a href="#" class="icoTwitter" title="Twitter">
							<xsl:attribute name="href">https://twitter.com/home?status=http://www.segfault.co.uk/<xsl:value-of select="document('article-list.xml')/articles/article[1]/@href"/></xsl:attribute>
							<i class="fa fa-twitter"></i></a></li>
                        <li><a href="#" class="icoGoogle" title="Google +">
							<xsl:attribute name="href">https://plus.google.com/share?url=http://www.segfault.co.uk/<xsl:value-of select="document('article-list.xml')/articles/article[1]/@href"/></xsl:attribute>
							<i class="fa fa-google-plus"></i></a></li>
                    </ul>				
				</div>

					<a class="btn btn-labeled btn-default">
						<xsl:attribute name="href"><xsl:value-of select="document('article-list.xml')/articles/article[2]/@href"/></xsl:attribute>
						<span class="btn-label"><i class="glyphicon glyphicon-chevron-left"></i></span> <xsl:value-of select="document('article-list.xml')/articles/article[2]/@title"/>
					</a>



					<br/>
<div id="disqus_thread"></div>
<script><![CDATA[

/**
 *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
 *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables */

var disqus_config = function () {
    this.page.url = "http://www.segfault.co.uk/]]><xsl:value-of select="document('article-list.xml')/articles/article[1]/@href"/><![CDATA[";  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = "]]><xsl:value-of select="document('article-list.xml')/articles/article[1]/@title"/><![CDATA["; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};

(function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = '//segfault-1.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();
]]></script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
	</xsl:template>

	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
