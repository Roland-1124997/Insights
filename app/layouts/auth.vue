<template>
	<UtilsApp :disablePwaPrompt="true">
		<UtilsDotPattern class="opacity-60" :width="20" :height="20" :cx="1" :cy="1" :cr="1" />

		<aside class="relative hidden lg:flex lg:w-2/3 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-300">
			<div class="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
				<header>
					<div class="flex items-center space-x-3">
						<div class="flex items-center justify-center w-12 h-12 bg-white rounded-xl">
							<img src="\icons\icon_512-white.svg" alt="Buildboard Logo" draggable="false" class="rounded-lg w-11 h-11" />
						</div>
						<p class="text-2xl font-bold text-white">Buildboard</p>
					</div>
				</header>

				<section class="space-y-6">
					<h1 class="text-4xl font-bold leading-tight text-white xl:text-5xl">
						Welkom terug bij<br />
						Buildboard
					</h1>
					<p class="max-w-md text-lg text-gray-300">Je persoonlijke dashboard voor het beheren van artikelen, het inzien van emails en het analyseren van je website statistieken.</p>

					<div class="pt-8 space-y-4">
						<div class="flex items-center space-x-3 text-gray-200">
							<div class="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-white/10">
								<Icon name="akar-icons:newspaper" class="w-5 h-5" />
							</div>
							<p>Artikelen schrijven en beheren</p>
						</div>
						<div class="flex items-center space-x-3 text-gray-200">
							<div class="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-white/10">
								<Icon name="akar-icons:inbox" class="w-5 h-5" />
							</div>
							<p>Email notificaties bekijken</p>
						</div>
						<div class="flex items-center space-x-3 text-gray-200">
							<div class="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg bg-white/10">
								<Icon name="akar-icons:panel-split" class="w-5 h-5" />
							</div>
							<p>Website analytics en inzichten</p>
						</div>
					</div>
				</section>

				<footer class="text-sm text-gray-400">© 2025 Portfolio Dashboard.</footer>
			</div>
		</aside>

		<main class="z-10 flex flex-col w-full px-6 md:justify-center md:w-fit sm:px-12 lg:px-16 xl:px-24">
			<div class="w-full max-w-md mx-auto">
				<header class="mt-12 mb-8 lg:hidden">
					<div class="flex items-center space-x-3">
						<div class="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
							<img src="\icons\icon_512-blue.svg" alt="Buildboard Logo" draggable="false" class="w-10 h-10 rounded-lg" />
						</div>
						<p class="text-2xl font-bold text-gray-900">Buildboard</p>
					</div>
				</header>

				<slot></slot>
			</div>
		</main>
	</UtilsApp>
</template>
