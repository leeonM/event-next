import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async ({searchParams}:SearchParamProps) => {
  const {sessionClaims} = auth()
  const userId = sessionClaims?.userId as string

 const ordersPage = Number(searchParams?.ordersPage) || 1
 const eventsPage = Number(searchParams?.eventsPage) || 1

 const orders = await getOrdersByUser({userId, page: ordersPage})
 const orderedEvents = orders?.data.map((order:IOrder)=> (order.event || []))
 const organizedEvents = await getEventsByUser({userId,page:eventsPage})

  return (
    <>
        {/* My tickets */}
        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <div className='wrapper flex items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>
                    My Tickets
                </h3>
                <Button size='lg' asChild>
                <Link href='/#events'
                className='button hidden sm:flex'
                >
                 Explore More Events
                </Link>
            </Button>
            </div>
        </section>

        <section className='wrapper my-8'>
        <Collection 
           userId={userId}
           data={orderedEvents}
           emptyTitle="No Event tickets purchased yet"
           emptyStateSubtext="no worries - plenty of exciting events to explore"
           collectionType="My_Tickets"
           limit={3}
           page={ordersPage}
           urlParamName="ordersPage"
           totalPages={orders?.totalPages}
          />
        </section>

        <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
            <div className='wrapper flex items-center justify-center sm:justify-between'>
                <h3 className='h3-bold text-center sm:text-left'>
                    Events Organized
                </h3>
                <Button size='lg' asChild>
                <Link href='/events/create'
                className='button hidden sm:flex'
                >
                 Create New Event
                </Link>
            </Button>
            </div>
        </section>

        {/* events organized */}
        <section className='wrapper my-8'>
        <Collection 
           userId={userId}
           data={organizedEvents?.data}
           emptyTitle="No Event have been created yet"
           emptyStateSubtext="go create some now"
           collectionType="Events_Organized"
           limit={6}
           page={eventsPage}
           urlParamName="eventsPage"
           totalPages={organizedEvents?.totalPages}
          />
        </section>
    </>
  )
}

export default ProfilePage