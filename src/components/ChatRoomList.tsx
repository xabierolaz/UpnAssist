import React from 'react';
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  LockClosedIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useChatRooms } from '../context/ChatRoomsContext';
import type { Subject, SubjectRoom } from '../types/subject';

interface ChatRoomListProps {
  onRoomSelect: (room: SubjectRoom) => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ onRoomSelect }) => {
  const { subjects, activeRooms, selectedRoom, joinRoom, leaveRoom } = useChatRooms();

  const handleRoomClick = (subject: Subject) => {
    const existingRoom = activeRooms.find(r => r.subject.id === subject.id);
    if (existingRoom) {
      onRoomSelect(existingRoom);
    } else {
      joinRoom(subject);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 mr-2" />
          Salas de Chat
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {subjects.map((subject) => {
          const isActive = activeRooms.some(r => r.subject.id === subject.id);
          const room = activeRooms.find(r => r.subject.id === subject.id);
          const isSelected = selectedRoom?.subject.id === subject.id;

          return (
            <div
              key={subject.id}
              onClick={() => handleRoomClick(subject)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                isSelected ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{subject.name}</h4>
                  <p className="text-sm text-gray-500">{subject.code}</p>
                </div>
                {isActive && room && (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center text-gray-500 text-sm">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>{room.participantCount}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{formatTime(room.lastActivity)}</span>
                    </div>
                    <LockClosedIcon className="h-4 w-4 text-green-500" title="Cifrado activo" />
                  </div>
                )}
              </div>

              {isActive && selectedRoom?.subject.id === subject.id && (
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      leaveRoom(subject.id);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Salir
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatRoomList;
