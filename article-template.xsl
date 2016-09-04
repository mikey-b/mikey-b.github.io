<xsl:stylesheet version="1.0"
   xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
   xmlns:html="http://www.w3.org/1999/xhtml"
   xmlns="http://www.w3.org/1999/xhtml"
   exclude-result-prefixes="xsl html">

	<xsl:import href="site-template.xsl"/>

	<xsl:template match="/html:html/html:head">
		<xsl:copy>
			<base href="../"/>
			<xsl:apply-templates select="@*"/>
			<!-- Workaround for Microsoft Bug #s 636728 and 572123  X-UA-Compatible meta is ignored when inside conditional comments -->
			<meta http-equiv="X-UA-Compatible" content="IE=9"/>
			<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
			<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
			<script src="script.js"></script>

			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" type="text/css"/>
			<link rel="stylesheet" href="css/font-awesome.min.css"/>
			<link rel="stylesheet" href="style.css"/>
			
			<xsl:apply-templates select="node()"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>
