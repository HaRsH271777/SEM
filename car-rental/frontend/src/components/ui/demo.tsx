import { Sidebar } from '@/components/ui/modern-side-bar';
import { Home } from 'lucide-react';

const DemoOne = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar
        items={[{ id: 'dashboard', name: 'Dashboard', icon: Home, href: '/dashboard' }]}
        activeItem="dashboard"
        onItemClick={() => {}}
      />
    </div>
  );
};

export { DemoOne };
