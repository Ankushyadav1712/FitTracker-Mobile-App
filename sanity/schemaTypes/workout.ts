import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  icon: () => '💪',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      description: 'The Clerk user ID of the person who performed this workout',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'The date and time when the workout took place',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      description: 'Duration of the workout in seconds',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'exercises',
      title: ' Workout Exercises',
      type: 'array',
      description: 'The exercises performed in this workout',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workoutExercise',
          title: 'workout Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              description: 'the exercise that was performed',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              description: 'The sets performed for this exercise with reps and weight details',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'exerciseSet',
                  title: 'Exercise Set',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Repetitions',
                      description: 'The number of repetitions performed in this set',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      description: 'The weight used for this set',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      description: 'The unit of measurement for the weight',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Pounds (lbs)', value: 'lbs'},
                          {title: 'Kilograms (kg)', value: 'kg'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'lbs',
                    }),
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      weightUnit: 'weightUnit',
                    },
                    prepare({reps, weight, weightUnit}) {
                      return {
                        title: `Set: ${reps} reps`,
                        subtitle: weight ? `${weight} ${weightUnit}` : 'Bodyweight',
                      }
                    },
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: 'exercise.name',
              sets: 'sets',
            },
            prepare({title, sets}) {
              const setCount = sets ? sets.length : 0
              return {
                title: title || 'Exercise',
                subtitle: `${setCount} set${setCount !== 1 ? 's' : ''}`,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
    },
    prepare({date, duration, exercises}) {
      const workoutDate = date ? new Date(date).toLocaleDateString() : 'No date'
      const durationMinutes = duration ? Math.round(duration / 60) : 0
      const exerciseCount = exercises ? exercises.length : 0

      return {
        title: `Workout - ${workoutDate}`,
        subtitle: `${durationMinutes} min · ${exerciseCount} exercise${
          exerciseCount !== 1 ? 's' : ''
        }`,
      }
    },
  },
})
