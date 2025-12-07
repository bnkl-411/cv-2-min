import { createWebHistory, createRouter } from 'vue-router'
import Cv from './components/Cv.vue'
import { useLoginModal } from '@/composables/useLoginModal'

const routes = [
    {
        path: '/',
        name: 'home',
        redirect: { name: 'cv' }
    },
    {
        path: '/cv/:id',
        name: 'cv',
        component: Cv
    },
    {
        path: '/cv/:id/edit',
        name: 'editCv',
        component: Cv,
        meta: { requiresAuth: true },
        sensitive: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from) => {
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token')
        const items = { ...localStorage };
        console.log(items);
        if (!token) {
            const { open } = useLoginModal()
            open(to.fullPath)
            return false
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/me", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const { open } = useLoginModal()
                open(to.fullPath)
                return false
            }

            const data = await response.json()

            if (to.params.id && data.slug !== to.params.id) {
                const { open } = useLoginModal()
                open(to.fullPath)
                return false  // ou return { name: 'cv', params: { id: data.slug } }
            }

        } catch (error) {
            console.error('Auth error:', error)
            const { open } = useLoginModal()
            open(to.fullPath)
            return false
        }
    }
})

export default router