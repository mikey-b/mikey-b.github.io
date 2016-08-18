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
					<xsl:apply-templates select="document(document('article-list.xml')/articles/article[1]/@href)"/>

					<a class="btn btn-default">
						<xsl:attribute name="href"><xsl:value-of select="document('article-list.xml')/articles/article[2]/@href"/></xsl:attribute>
						&lt; <xsl:value-of select="document('article-list.xml')/articles/article[2]/@title"/>
					</a>
	</xsl:template>

	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
