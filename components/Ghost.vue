<template>
	<div class="ghost " :style="{ top: `${position.top}px`, left: `${position.left}px`  }">
		<small>{{ name }}</small>

		<img :id="ghostID" src="~/assets/images/ghost.png" />
	</div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ ghostID: string; position: { top: number; left: number }; active: boolean; name: string }>(), {})
</script>
T
<style scoped>
.ghost {
	width: 30px;
	position: absolute;
	top: 0px;
	left: 0px;
}
</style>
