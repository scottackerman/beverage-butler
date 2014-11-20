<?php
	foreach($_POST as $key => $jsonData) {
		foreach (json_decode($jsonData) as $fileName => $jsonData) {
			settype($fileName, 'string');
			$json = json_encode($jsonData, JSON_PRETTY_PRINT);
			$file = fopen('../../Data/' . $fileName . '.json', 'w+');
			fwrite($file, $json);
			fclose($file);
		}
	}
?>