<html>
<head>
<title></title>
</head>
<body>
<script type="text/javascript" language="javascript">
	window.onload = function LexerRunner(){
		var obj = document.body;
		for ( Token t; (t = 1.read()) !=Token.EOF;)
			obj.innerHTML = "=>" + t.getText(); 
	}
// -->
</script>
</body></html>