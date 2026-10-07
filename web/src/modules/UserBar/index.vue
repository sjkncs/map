<script setup lang="ts">
import { Button, ContentBar, Input } from 'lovelymaid'
import { ref } from 'vue'

import barStore from '@/stores/bar'
import userStore from '@/stores/user'
import { login, register } from './services/auth'
import { verifyName, verifyPassword } from '@map/shared/services/user'

import UserPic from '../modules/UserPic.vue'

// 输入框
const status = ref<'login' | 'register'>('login')
const NameInputRef = ref<InstanceType<typeof Input> | null>(null)
const PasswordInputRef = ref<InstanceType<typeof Input> | null>(null)
const name = ref<string>('')
const password = ref<string>('')
const nameWarning = ref<boolean>(false)
const passwordWarning = ref<boolean>(false)
// 校验用户名输入，失败返回 false
const verifyNameInput = (): boolean => {
  const result = verifyName(name.value)
  if (!result.success) {
    alert(result.error.issues[0].message)
    nameWarning.value = true
    NameInputRef.value?.focus()
    return false
  }
  return true
}
// 校验密码输入，失败返回 false
const verifyPasswordInput = (): boolean => {
  const result = verifyPassword(password.value, {
    minLength: status.value === 'register' ? 6 : undefined,
  })
  if (!result.success) {
    alert(result.error.issues[0].message)
    passwordWarning.value = true
    PasswordInputRef.value?.focus()
    return false
  }
  return true
}
const onNameEnter = () => {
  if (!verifyNameInput()) return
  PasswordInputRef.value?.focus()
}
const submit = async () => {
  const res =
    status.value === 'login'
      ? await login(name.value, password.value)
      : await register(name.value, password.value)
  if (res.success) {
    name.value = ''
    password.value = ''
  } else if (res.message === '密码错误') {
    passwordWarning.value = true
    PasswordInputRef.value?.focus()
  }
}
const onPasswordEnter = async () => {
  if (!verifyPasswordInput()) return
  await submit()
}
const onSubmitClick = async () => {
  if (!verifyNameInput() || !verifyPasswordInput()) return
  await submit()
}
</script>

<template>
  <ContentBar
    class="ContentBar"
    :visible="barStore.userbarIsVisible"
    :is-open="true"
    :on-close-click="() => (barStore.userbarIsVisible = false)"
  >
    <template #header>{{ '' }}</template>
    <UserPic class="UserPic" />
    <h3 v-if="userStore.isLogined">{{ userStore.name }}</h3>
    <h3 v-if="!userStore.isLogined && status === 'login'">请登录</h3>
    <h3 v-if="!userStore.isLogined && status === 'register'">请注册</h3>
    <div class="auth" v-if="!userStore.isLogined">
      <Input
        class="Input"
        ref="NameInputRef"
        v-model:value="name"
        placeholder="用户名"
        enterkeyhint="next"
        v-model:warning="nameWarning"
        :onEnter="onNameEnter"
      >
        <span class="iconfont icon-username"></span>
      </Input>
      <Input
        class="Input"
        ref="PasswordInputRef"
        type="password"
        v-model:value="password"
        placeholder="密码"
        enterkeyhint="done"
        v-model:warning="passwordWarning"
        :on-enter="onPasswordEnter"
      >
        <span class="iconfont icon-password"></span>
      </Input>
      <Button class="Button" v-if="status === 'login'" :onClick="onSubmitClick">
        <span>登录</span>
      </Button>
      <Button class="Button" v-if="status === 'register'" :onClick="onSubmitClick">
        <span>注册</span>
      </Button>
      <div class="tip" v-if="status === 'login'">
        没有账号？<span class="switch" @click.stop="() => (status = 'register')">去注册</span>
      </div>
      <div class="tip" v-if="status === 'register'">
        已有账号？<span class="switch" @click.stop="() => (status = 'login')">去登录</span>
      </div>
    </div>
    <div class="settings" v-else @click.stop="() => userStore.logout">退出登录</div>
  </ContentBar>
</template>

<style scoped>
.UserPic {
  width: 30%;
  margin: 0 auto;
}

h3 {
  margin: 20px 0;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
}

/** 验证 */
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 60%;
  margin: 0 auto;
}

.Input {
  height: 40px;
}

.Button {
  width: 60px;
  margin: 0 auto;
}

.Button span {
  font-size: 14px;
  color: #fff;
}

.tip {
  font-size: 12px;
  text-align: center;
}

.tip .switch {
  font-weight: 600;
  color: #3b86f7;
  cursor: pointer;
}

/** 设置 */
.settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 60%;
  margin: 0 auto;
  background-color: #eee;
  cursor: pointer;
}
</style>
