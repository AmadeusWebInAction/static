/**
 * v2.5 of the engage feature - a part of v7.AmadeusWeb.com
 * **** Get Emails with details on each call to action.
 * 
 * DO NOTE: This is proprietary software by Imran Ali Namazi.
 * It cannot be reused, distributed or derived without
 * prior written consent after paying a royalty for it.
 */

if (typeof($) === 'undefined') $ = jQuery.noConflict();

$(document).ready(function() {
	var divs = $('.engage');
	if (divs.length == 0) return;

	function safeScrollWithOffset(element) {
		if (window.amadeusUtils)
			window.amadeusUtils.scrollWithOffset(element);
		else
			element.scrollIntoView();
	}

	$('.engage li').each(checkboxAdd);

	divs.each(function(ix, div) {
		div = $(div);
		var name = div.data('name');
		$('<input type="text" class="name full-width" placeholder="[My Name]" />').appendTo(div);
		$('<button class="btn btn-primary btn-large full-width">Prepare message to ' + name + '</button>').click(prepareEmail).appendTo(div);
	});

	$('.toggle-engage').click(function() {
		const targetId = $(this).data('engage-target');

		$('.engage:not(#' + targetId + ')').hide();
		const target = $('#' + targetId);

		if ($(this).hasClass('engage-scroll')) {
			target.show();
			safeScrollWithOffset(target[0]);
		} else {
			target.toggle();
		}
	});


	function prepareEmail() {
		var div = $(this).closest('.engage');

		var ta = $('.engage textarea');
		if (ta.length == 0)
			ta = $('<textarea rows="8" style="width: 100%; background-color: #aaf"></textarea>').appendTo(div);

		var items = $('.engage input[type=checkbox]:checked');
		if (items.length == 0) {
			ta.text('No Items Ticked');
		} else {
			var headings = {}, firstHeading = true, output = '';

			items.each(function() {
				var item = $(this).closest('li');
				var note = $('input[type=text]', item);
				var ul = item.closest('ul, ol');
				var hx = ul.prevAll('h2:first, h3:first').text();
				if (!headings[hx]) {
					if (!firstHeading) output += "\r\n\r\n";
					firstHeading = false;
					output += "# " + hx;
					headings[hx] = true;
				}
				output += "\r\n" + item.text() + "\r\n -> " + note.val();
			});

			ta.text(output);
			prepareEmailLink(output, div);
		}
	}

	function prepareEmailLink(body, div) {
		var emailTo = div.data('to');
		var emailCc = div.data('cc');
		var name = div.data('name');

		var email = emailTo.replace(';', '%3B%20');

		var user = $('.name', div).val();

		var subject = '%name% enquiry by "%user%" on %date% from %site%'
				.replace('%name%', name)
				.replace('%user%', user)
				.replace('%site%', document.title)
				.replace('%date%', new Date().toDateString())
			;

		body += "\r\n\r\n\r\n" + subject + ' at' + "\r\n -> " + location.href;

		body = encodeURIComponent(body).replace(':', '%3A');

		var link = 'mailto:%email%?cc=%cc%&subject=%subject%&body=%body%'
			.replace('%email%', email)
			.replace('%cc%', emailCc)
			.replace('%subject%', encodeURIComponent(subject))
			.replace('%body%', body);

		var tag = $('.btn-send', div);

		if (tag.length == 0)
			tag = $('<a class="btn-send btn btn-primary btn-fill" target="_blank" />')
				.text('Send Email (opens mail client)')
				.appendTo(div);

		tag.attr('href', link);
		//TODO: why doesnt email trigger click work?
		//setTimeout(function () { tag.trigger('click') }, 200);
	}

	function checkboxAdd(ix, el) {
		el = $(el);
		el.html('<label>' + el.html() + '</label>');
		var label = $('label', el);
		$('<input type="checkbox" />').on('change', checkboxToggle).prependTo(label);
		$('<br/><input type="text" style="display: none; width: 100%" />').appendTo(el);
	}

	function checkboxToggle(ev) {
		if (event.originalEvent && $(event.originalEvent.target).closest('a').length) return;
		const txt = $('input[type=text]', $(this).closest('li'));
		if($(this).is(':checked')) txt.show(); else txt.hide();
	}
});
