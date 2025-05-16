<template>
	<img
		:id="ghostID"
		src="~/assets/images/ghost.png"
		class="ghost"
		:style="{ top: `${position.top}px`, left: `${position.left}px`, display: active ? 'block' : 'none' }" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ ghostID: string; position: { top: number; left: number }; active: boolean }>(), {})
</script>
