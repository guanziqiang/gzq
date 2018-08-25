/**
 * 
 */

$('#headerId').load('../header.html');

function loadContent(prefix){
    $('#content').html('');
    $('#content').load(prefix + '.html');
}
