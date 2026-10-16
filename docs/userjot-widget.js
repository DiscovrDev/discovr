// UserJot Widget SDK Loader
window.$ujq = window.$ujq || [];
window.uj =
	window.uj ||
	new Proxy(
		{},
		{
			get:
				(_, p) =>
				(...a) =>
					window.$ujq.push([p, ...a]),
		},
	);
document.head.appendChild(
	Object.assign(document.createElement("script"), {
		src: "https://cdn.userjot.com/sdk/v2/uj.js",
		type: "module",
		async: !0,
	}),
);

// UserJot Widget Configuration
window.uj.init("cmhml6795035j15o8mia3w8zw", {
	widget: true,
	position: "right",
	theme: "auto",
});
