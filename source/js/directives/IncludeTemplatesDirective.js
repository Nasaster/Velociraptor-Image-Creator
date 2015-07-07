// simple "factory" method to load the templates into the views using the directives

(function()
{
	// define here all view bindings

	var views = [
		{ div : 'formSize',     template: 'views/form.size.html' },
		{ div : 'formType',     template: 'views/form.type.html' },
		{ div : 'formColors',   template: 'views/form.colors.html' },
		{ div : 'formFilltype', template: 'views/form.filltype.html' },
		{ div : 'formGrid',     template: 'views/form.grid.html' },
		{ div : 'preview',		template: 'views/preview.html'}
	];

	// don't touch ;)

	var i = -1, amountToCreate = views.length;

	function createView( $parse )
	{
		var view = views[ ++i ];

	    return {
	        templateUrl: view.template
	    };
	};

	views.forEach( function( view ) {
		app.directive( view.div, [ '$parse', createView ]);
	});
})();
