import React from 'react'
import { Text, View } from 'react-native'

const EmptyState = ({ title, description }: { title: string, description: string }) => {
    return (
        <View className='items-center justify-center py-10 bg-bg dark:bg-bg-dark'>
            <Text className='text-lg font-semibold text-text dark:text-text-dark'>{title}</Text>
            <Text className='text-sm text-text-secondary dark:text-text-darkMuted mt-2 text-center'>{description}</Text>
        </View>
    )
}

export default EmptyState