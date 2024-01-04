import { createRouter, createWebHistory } from 'vue-router'
import { myMSALObj } from '@/stores/auth.store'
import { type AccountInfo } from '@azure/msal-browser'
import MainLayoutVue from '@/layouts/MainLayout.vue'
import NavBarVue from '@/components/NavBar.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: NavBarVue,
      children: [
        {
          path: 'Mainlayout',
          component: MainLayoutVue
        }
      ]
    },
    {
      path: '/admin',
      name: 'Admin',
      component: AdminLayout,
      meta: {
        requiresAdmin: true
      }
    }
  ]
})
router.beforeEach(async (to, from) => {
  const accounts: AccountInfo[] | null = myMSALObj.getAllAccounts()
  if (to.matched.some((record) => record.meta.requiresAdmin)) {
    if (
      !accounts ||
      accounts.every(
        (account) => !account.idTokenClaims || !account.idTokenClaims?.roles?.includes('admin')
      )
    ) {
      // Redirect to a login page or show an error message
      return { name: 'Login' }
    }
  }
})
export default router
