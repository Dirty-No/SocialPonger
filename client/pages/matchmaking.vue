<template>
	<div class="h-full w-full flex justify-center items-center text-center overflow-y-scroll no-scrollbar select-none">
		<div :class="`${$device.isMobile ? 'w-full h-full' : 'w-1/2 h-5/6'}`">
			<Matchmaking />
		</div>
	</div>
</template>
