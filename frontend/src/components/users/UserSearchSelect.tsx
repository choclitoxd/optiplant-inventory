import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, X, ShieldCheck } from '@phosphor-icons/react';
import type { User as UserType } from '../../types/user';
import { userService } from '../../services/userService';

interface UserSearchSelectProps {
  value: string;
  onChange: (username: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  theme?: 'dark' | 'light';
}

export const UserSearchSelect = ({ 
  value, 
  onChange, 
  placeholder = "Buscar responsable...", 
  className = "",
  disabled = false,
  theme = 'dark'
}: UserSearchSelectProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch users when opening
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      userService.searchUsers(query).then(res => {
        setUsers(res);
      }).finally(() => setLoading(false));
    }
  }, [isOpen, query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedUser = users.find(u => u.username === value) || (value ? { username: value, fullName: value, roles: ['ROLE_OPERATOR'] } as UserType : null);

  const getRoleBadgeColor = (role?: any) => {
    const roleStr = typeof role === 'string' ? role : (role?.name || '');
    if (!roleStr) return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    if (roleStr === 'ROLE_ADMIN') return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    if (roleStr === 'ROLE_BRANCH_MANAGER') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  const formatRole = (role?: any) => {
    const roleStr = typeof role === 'string' ? role : (role?.name || '');
    return roleStr ? roleStr.replace('ROLE_', '') : 'N/A';
  };

  if (value && selectedUser) {
    // Chip view when a user is selected
    const chipBg = theme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-800/80 border-slate-700';
    const textMain = theme === 'light' ? 'text-slate-800' : 'text-white';
    const textSub = theme === 'light' ? 'text-slate-500' : 'text-slate-400';
    const avatarBg = theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-700 border-slate-600';

    return (
      <div className={`relative z-10 flex items-center justify-between border rounded-xl p-2.5 transition-all ${chipBg} ${className} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center text-emerald-500 font-bold border shadow-inner ${avatarBg}`}>
            {selectedUser.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex flex-col truncate">
            <span className={`text-sm font-bold truncate ${textMain}`}>{selectedUser.fullName}</span>
            <span className={`text-xs font-medium ${textSub}`}>@{selectedUser.username}</span>
          </div>
          <span className={`hidden sm:inline-flex items-center ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeColor(selectedUser.roles?.[0])}`}>
            {formatRole(selectedUser.roles?.[0])}
          </span>
        </div>
        {!disabled && (
          <button 
            onClick={() => {
              onChange('');
              setQuery('');
            }}
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${theme === 'light' ? 'text-slate-400 hover:text-rose-500 hover:bg-slate-100' : 'text-slate-400 hover:text-rose-400 hover:bg-slate-700/80'}`}
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>
    );
  }

  const inputBg = theme === 'light' ? 'bg-slate-50 focus-within:bg-white border-slate-300' : 'bg-slate-800/80 border-slate-700';
  const inputText = theme === 'light' ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-slate-500';
  
  // Search input view
  return (
    <div ref={wrapperRef} className={`relative z-20 ${className}`}>
      <div className={`flex items-center border rounded-xl px-3 transition-all ${inputBg} ${isOpen ? 'border-emerald-500 ring-1 ring-emerald-500' : ''} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
        <MagnifyingGlass size={18} className="text-slate-400" weight="bold" />
        <input 
          type="text" 
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className={`w-full bg-transparent p-3 outline-none text-sm font-medium ${inputText}`}
        />
      </div>

      {/* Dropdown Bento */}
      {isOpen && !disabled && (
        <div className={`absolute top-full left-0 w-full mt-2 border rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-slate-800/95 backdrop-blur-xl border-slate-700'}`}>
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center p-4 gap-3 text-slate-400">
                <div className="animate-spin h-5 w-5 border-2 border-slate-600 border-t-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium">Buscando...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-sm font-medium">
                No se encontraron responsables
              </div>
            ) : (
              <ul className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                {users.map(u => (
                  <li 
                    key={u.id}
                    onClick={() => {
                      onChange(u.username);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors group ${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-slate-700/50'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border transition-colors ${theme === 'light' ? 'bg-slate-100 border-slate-200 text-slate-500 group-hover:border-emerald-400 group-hover:text-emerald-500' : 'bg-slate-900 border-slate-700 text-slate-300 group-hover:border-emerald-500/50 group-hover:text-emerald-400'}`}>
                      {u.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className={`text-sm font-bold truncate transition-colors ${theme === 'light' ? 'text-slate-800 group-hover:text-emerald-600' : 'text-slate-200 group-hover:text-white'}`}>{u.fullName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">@{u.username}</span>
                        <span className="text-[10px] text-slate-600 font-bold">•</span>
                        <span className="text-[10px] font-bold text-slate-500 truncate">ID: #{u.id}</span>
                      </div>
                    </div>
                    <ShieldCheck size={18} className="text-slate-600 group-hover:text-emerald-500 transition-colors" weight="duotone" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
