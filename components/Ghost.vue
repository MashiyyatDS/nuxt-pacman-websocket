<template>
	<div class="ghost flex" :style="{ top: `${position.top}px`, left: `${position.left}px`, display: active ? 'block' : 'none' }">
		<small>{{ name }}</small>

		<img :id="ghostID" src="~/assets/images/ghost.png" />
	</div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ ghostID: string; position: { top: number; left: number }; active: boolean; name: string }>(), {})
</script>
