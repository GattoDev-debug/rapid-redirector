describe("the options page", function() {
	/*
		Notes: 
		FQ = 'fully qualified'
	*/
	describe("the hasValue function", function() {
		/* 	Tests:
			empty object, empty source, empty destination - false
			object, wrong key, matching value - false
			object, matching key, wrong value - false
			object, matching key, matching value - true
		*/
		it("should return false given empty arguments (of the correct type)", function() {
			expect(hasValue({}, '', '')).toBe(false);
		});

		it("should return false when given an object, an invalid key, and a valid value", function() {
			var key = "key";
			var value = "value";
			var obj = {testKey: value};

			expect(hasValue(obj, key, value)).toBe(false);
		});

		it("should return false when given an object, a valid key, and an invalid value", function() {
			var key = "testKey";
			var value = "value";
			var obj = {testKey: "invalid"};

			expect(hasValue(obj, key, value)).toBe(false);
		});

		it("should return true when given an object with a valid key and value pair", function() {
			var key = "testKey";
			var value = "value";
			var obj = {testKey: "value"};

			expect(hasValue(obj, key, value)).toBe(true);
		});
	});

	describe("the hasChars function", function() {
		/* 	Tests:
			empty string - false
			whitespace string - false
			non-whitespace string - true
			whitespace and character string - true
		*/
		it("should return false for an empty string", function() {
			expect(hasChars('')).toBe(false);
		});

		it("should return false for a string with only whitepsace characters in it", function() {
			expect(hasChars('   \t	\t\t  \t	  ')).toBe(false);
		});

		it("should return true for a string with only non-whitespace characters in it", function() {
			expect(hasChars('test_string')).toBe(true);
		});

		it("should return true for a string with both whitespace and non-whitespace characters in it", function() {
			expect(hasChars('\tthis is a test string!')).toBe(true);
		});

	});

	describe("the getButtonIndex function", function() {
		/* 	Tests:
			empty string - null
			buttonId without digits at the end - null
			buttonId ending in 0 - 0
			buttonId ending in 999 - 999
		*/
		it("should return null when given an empty string", function() {
			expect(getButtonIndex('')).toBeNull();
		});

		it("should return null when given a buttonId that doesn't have any digits at the end", function() {
			expect(getButtonIndex('deleteRuleButton-')).toBeNull();
		});

		it("should return the number 0 when given a buttonId that ends with a 0", function() {
			expect(getButtonIndex('deleteRuleButton-0')).toBe(0);
		})

		it("should return the number 999 when given a buttonId that ends with a 999", function() {
			expect(getButtonIndex('deleteRuleButton-999')).toBe(999);
		});
	});

	describe("the calcTimeToReadString function", function() {
		/* 	Tests:
			empty string - 0
			non empty string - number > 0
		*/
		it("should return 0 when given an empty string", function() {
			expect(calcTimeToReadString('')).toBe(0);
		});

		it("should return a number, greater than 0 when given a non-empty string", function() {
			expect(calcTimeToReadString('non-empty string')).toBeGreaterThan(0);
		});
	});

	describe("the getSubdomainDifference function", function() {
		/*	Tests:
			empty source, empty destination - 0
			FQ source with no subdomains, FQ destination with no subdomains - 0 <- FIX
			FQ source with one subdomain, FQ destination with one subdomain - 0 <- FIX
			FQ source with one subdomain, FQ destination with no subdomains - 0 <- FIX
			source with no subdomains, destination with no subdomains - 0
			source with one subdomain, destination with one subdomain - 0
			source with one subdomain, destination with no subdomains - 1
			source no subdomains, destination with one subdomain - 1
			source with three subdomains, destination with two of the same subdomains - 1
			destination with three subdomains, source with two of the same subdomains - 1
			source with five subdomains, destination with no subdomains - 5
		*/
		it("should return 0 when given an empty source and destination", function() {
			expect(getSubdomainDifference('','')).toBe(0);
		});

		it("should return 0 when given a fully qualified source and fully qualified destination with no subdomains", function() {
			expect(getSubdomainDifference('http://nickschorr.com/','http://nickschorr.com/')).toBe(0);
		});

		it("should return 0 when given a fully qualified source and fully qualified destination with one subdomain each", function() {
			expect(getSubdomainDifference('http://one.nickschorr.com/','http://two.nickschorr.com/')).toBe(0);
		});

		it("should return 0 when given a fully qualified source with one subdomain and a fully qualified destination with no subdomains", function() {
			expect(getSubdomainDifference('http://one.nickschorr.com/','http://nickschorr.com/')).toBe(0);
		});

		it("should return 0 when given a source and destination with no subdomains", function() {
			expect(getSubdomainDifference('nickschorr.com','nickschorr.com')).toBe(0);
		});

		it("should return 0 when given a source and destination with a single subdomain each", function() {
			expect(getSubdomainDifference('one.nickschorr.com','two.nickschorr.com')).toBe(0);
		});

		it("should return 1 when given a source with one subdomain, and a destination with no subdomain", function() {
			expect(getSubdomainDifference('one.nickschorr.com','nickschorr.com')).toBe(1);
		});

		it("should return 1 when given a source with no subdomain, and a destination with one subdomain", function() {
			expect(getSubdomainDifference('nickschorr.com','one.nickschorr.com')).toBe(1);
		});

		/* 'of the same subdomains' refers to matching nested subdomains as the other domain, like a subset */
		it("should return 1 when given a source with three subdomains and destination with two of the same subdomains", function() {
			expect(getSubdomainDifference('three.two.one.nickschorr.com','two.one.nickschorr.com')).toBe(1);
		});

		it("should return 1 when given a destination with three subdomains, and a source with two of the same subdomains", function() {
			expect(getSubdomainDifference('two.one.nickschorr.com','three.two.one.nickschorr.com')).toBe(1);
		});

		it("should return 5 when given a source with five subdomains and destination with no subdomains", function() {
			expect(getSubdomainDifference('one.two.three.four.five.nickschorr.com','nickschorr.com')).toBe(5);
		});
	});

	describe("the isValidInput function", function() {
		/* 	Tests:
			// Tests the whitespace checker
			empty source, empty destination, empty rules array - false
			empty source, non-empty destination, empty rules array - false
			non-empty source, empty destination, empty rules array - false
			// Tests the duplicate source checker (destination arg doesn't matter)
			non-empty source, empty destination, rules array with matching non-empty source as the source at the beginning - false
			non-empty source, empty destination, rules array with matching non-empty source as the source at the end - false
			// Tests the cycle checker (destination arg doesn't matter)
			non-empty source, empty destination, rules array with matching non-empty source as the destination at the beginning - false
			non-empty source, empty destination, rules array with matching non-empty source as the destination at the end - false
			// Tests a valid input
			non-empty source, non-empty destination, rules array without any duplicate sources and no destinations matching the non-empty source - true
		*/
		it("should return false for empty source, destination, and rules arguments", function() {
			expect(isValidInput('','',[])).toBe(false);
		});

		it("should return false for an empty source, a valid destination, and an empty rules argument", function() {
			expect(isValidInput('', 'nickschorr.com', [])).toBe(false);
		});

		it("should return false for a valid source, an empty destination, and an empty rules argument", function() {
			expect(isValidInput('nickschorr.com', '', [])).toBe(false);
		});

		it("should return false for a source that's at the front of the rules array", function() {
			var source = "nickschorr.com"
			var rules = [
				{src:source, dest:"nickschorr.com/test/"},
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"}
			];

			expect(isValidInput(source, '', rules)).toBe(false);
		});

		it("should return false for a matching source that's at the end of the rules array", function() {
			var source = "nickschorr.com"
			var rules = [
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"},
				{src:source, dest:"nickschorr.com/test/"}
			];

			expect(isValidInput(source, '', rules)).toBe(false);
		});

		it("should return false for a source that matches a destination at the front of the rules array", function() {
			var source = "nickschorr.com"
			var rules = [
				{src:"nickschorr.com/test/", dest:source},
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"}
			];

			expect(isValidInput(source, '', rules)).toBe(false);
		});

		it("should return false for a source that matches a destination at the back of the rules array", function() {
			var source = "nickschorr.com"
			var rules = [
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"},
				{src:"nickschorr.com/test/", dest:source}
			];

			expect(isValidInput(source, '', rules)).toBe(false);
		});

		it("should return true for a nonempty source and destination, the source doesn't have any matches in the rules array, and the source isn't already a destination", function() {
			var rules = [
				{src:"nickschorr.com/path/", dest:"nickschorr.com/path/test/"},
				{src:"test.nickschorr.com/path/", dest:"test.nickschorr.com/path/test/"},
				{src:"test.sub.nickschorr.com/", dest:"sub.nickschorr.com/test/path/"}
			];

			expect(isValidInput('nickschorr.com', 'nickschorr.com/test/', rules)).toBe(true);
		});
	});
});