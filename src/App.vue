<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
import Login from "./components/ui/Login.vue"

const { isOpen, close } = useLoginModal()

</script>
<template>
	<main>
		<Login
			v-if="isOpen"
			@close="close"
		/>

		<RouterView />
	</main>
</template>