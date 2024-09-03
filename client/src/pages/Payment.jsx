import { List } from "flowbite-react"
import { useParams } from "react-router-dom"

export default function Payment() {

  return (
    <div className="flex p-8 m-8 rounded-xl align-center bg-mid-blue">
      <div className="flex-1 flex flex-col gap-8 justify-center text-center text-white">
        <h2 className="text-2xl font-semibold">Weekly Plan</h2>
        <h3>Only $4.99 per week</h3>
        <div>
          <List className="text-white text-sm opacity-60">
            <List.Item>Unlimited access to all exams</List.Item>
            <List.Item>Unlimited access to all questions</List.Item>
            <List.Item>Unlimited access to all reports</List.Item>
            <List.Item>Unlimited access to all answers</List.Item>
          </List>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-xl p-8">
        
      </div>
    </div>
  )
}
