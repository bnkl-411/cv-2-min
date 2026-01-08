<script setup>
import { ref, onMounted } from 'vue'
import { loader } from '@utils/renderLoader'
import { useLoginModal } from '@composables/useLoginModal'
import LoginModal from './components/ui/LoginModal.vue'


const { isOpen } = useLoginModal()

const isRouterLoading = ref(true)

onMounted(() => {
	loader.onChange(loading => {
		isRouterLoading.value = loading
	})
})

</script>

<template>
	<main>
		<div
			v-if="isRouterLoading"
			class="loader-container"
		>
			<div class="loader">
				<div class="loader-spinner"></div>
				<p class="loader-text">Chargement de l'app...</p>
				<p>
				<p class="loader-text">Cela peut prendre quelques minutes, profitez-en pour aller vous servir un café ou
					un thé ☕ avant de
					revenir découvrir la suite.</p>
				</p>
			</div>
		</div>
		<div v-else>

			<RouterView />

			<Teleport to="body">
				<LoginModal v-if="isOpen" />
			</Teleport>
		</div>


	</main>
</template>

<style>
.modal-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}
</style>
